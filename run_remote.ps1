$pw = ConvertTo-SecureString "2580" -AsPlainText -Force
$cred = New-Object System.Management.Automation.PSCredential ("admin", $pw)

Invoke-WmiMethod -Class Win32_Process -Name Create -ArgumentList "powershell.exe -ExecutionPolicy Bypass -WindowStyle Hidden -File C:\Clinic_MVP\INSTALL_MAIN_NODE.ps1" -ComputerName 192.168.1.103 -Credential $cred
