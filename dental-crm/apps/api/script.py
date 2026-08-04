import re

with open('src/db/schema.ts', 'r', encoding='utf-8') as f:
    content = f.read()

table_pattern = re.compile(r'export const (\w+) = pgTable\("([^"]+)", \{(.*?)\}(?:,\s*\((.*?)\)\s*=>\s*\(?\{(.*?)\}\)?)?\);', re.DOTALL)
matches = table_pattern.findall(content)

foreign_keys = []
indexes = []

for match in matches:
    export_name, table_name, columns_str, table_arg, index_str = match
    
    col_pattern = re.compile(r'(\w+):\s*[\w<>]+\("([^"]+)"\)(.*?)\.references\(\(\)\s*=>\s*(\w+)\.(\w+)')
    col_fks = col_pattern.findall(columns_str)
    
    for col_fks_match in col_fks:
        col_export_name, col_name, middle_chain, ref_table_var, ref_col_name = col_fks_match
        
        # Check if the column has .primaryKey() or .unique()
        if '.primaryKey()' in middle_chain or '.unique()' in middle_chain:
            # PostgreSQL already creates an index for these
            continue
            
        foreign_keys.append({
            'table': table_name,
            'column': col_name,
            'ts_column': col_export_name
        })

    if index_str:
        idx_pattern = re.compile(r'(?:index|uniqueIndex|unique)\("[^"]+"\)\.on\(([^)]+)\)')
        idxs = idx_pattern.findall(index_str)
        for idx in idxs:
            cols = [c.strip().split('.')[-1] for c in idx.split(',')]
            actual_cols = []
            for c in cols:
                c_pattern = re.compile(r'\b' + c + r'\s*:\s*[\w<>]+\("([^"]+)"\)')
                c_match = c_pattern.search(columns_str)
                if c_match:
                    actual_cols.append(c_match.group(1))
            if actual_cols:
                indexes.append({
                    'table': table_name,
                    'columns': actual_cols
                })

for match in matches:
    export_name, table_name, columns_str, table_arg, index_str = match
    if index_str:
        fk_block_pattern = re.compile(r'foreignKey\(\s*\{.*?columns:\s*\[([^\]]+)\].*?\}\s*\)', re.DOTALL)
        fk_blocks = fk_block_pattern.findall(index_str)
        for fk_cols_str in fk_blocks:
            cols = [c.strip().split('.')[-1] for c in fk_cols_str.split(',')]
            actual_cols = []
            for c in cols:
                c_pattern = re.compile(r'\b' + c + r'\s*:\s*[\w<>]+\("([^"]+)"\)')
                c_match = c_pattern.search(columns_str)
                if c_match:
                    actual_cols.append(c_match.group(1))
            
            if actual_cols:
                foreign_keys.append({
                    'table': table_name,
                    'column': actual_cols[0],
                    'ts_column': cols[0],
                    'is_multi': True,
                    'all_columns': actual_cols
                })

missing = []
for fk in foreign_keys:
    t = fk['table']
    if 'is_multi' in fk:
        found = False
        for idx in indexes:
            if idx['table'] == t and idx['columns'][:len(fk['all_columns'])] == fk['all_columns']:
                found = True
                break
        if not found:
            missing.append(f"{t}|{','.join(fk['all_columns'])}")
    else:
        c = fk['column']
        found = False
        for idx in indexes:
            if idx['table'] == t and idx['columns'][0] == c:
                found = True
                break
        
        if not found:
            missing.append(f"{t}|{c}")

for m in missing:
    print(m)
