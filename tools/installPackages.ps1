Expand-Archive -Path ".\server.zip" -DestinationPath ".\" -Force
Expand-Archive -Path ".\wwwroot\client.zip" -DestinationPath ".\wwwroot\" -Force
Remove-Item "package-lock.json"
npm install
iisreset