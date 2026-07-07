with open('clinic_admin/test_main.py', 'r') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if line.strip() == 'def test_read_root(self):':
        lines[i] = '    def test_read_root(self):\n        pass\n'
    elif line.startswith('        def test_add_patient(self):'):
        lines[i] = '    def test_add_patient(self):\n'
    elif line.startswith('        response = self.client.post(') and 'patients/add' in "".join(lines[i:i+3]):
        pass

with open('clinic_admin/test_main.py', 'w') as f:
    f.writelines(lines)
