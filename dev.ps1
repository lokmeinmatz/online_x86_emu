$base_path = "D:\Programmieren\GitHub\online_x86_emu"

$rust = $base_path + "\emulator"

Write-Output "setting up with base-path" $base_path

Start-Process "C:\Program Files\JetBrains\CLion 2019.2.5\bin\clion64.exe" $rust
Write-Output "starting vs code"
Start-Process "C:\Users\Matthias\AppData\Local\Programs\Microsoft VS Code\Code.exe" $base_path
Start-Process "C:\Users\Matthias\AppData\Local\Microsoft\WindowsApps\wt.exe" -ArgumentList ("-d " + $base_path)