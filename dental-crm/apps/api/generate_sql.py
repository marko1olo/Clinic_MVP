with open('script.py', 'r', encoding='utf-8') as f:
    script_content = f.read()

import subprocess
res = subprocess.run(['python', 'script.py'], capture_output=True, text=True)
missing_indexes = [line for line in res.stdout.split('\n') if line.strip()]

sql_lines = []
for item in missing_indexes:
    table, cols = item.split('|')
    col_list = cols.split(',')
    index_name = f"idx_{table}_{'_'.join(col_list)}"
    if len(index_name) > 63:
        index_name = index_name[:63]
        if index_name.endswith('_'):
             index_name = index_name[:-1]
    
    col_str = ', '.join(col_list)
    sql_lines.append(f"CREATE INDEX CONCURRENTLY IF NOT EXISTS {index_name} ON {table} ({col_str});")

migration_path = 'drizzle/0155_paranoid_fk_indexes.sql'
with open(migration_path, 'w', encoding='utf-8') as out:
    out.write('\n'.join(sql_lines) + '\n')
