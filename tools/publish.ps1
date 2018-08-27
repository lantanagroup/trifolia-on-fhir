##
## Requires the Pscx module
## Install-Module Pscx -Allowclobber
##

$servname = "service name"
$server = "dev7"
$remotePath = "\\dev7\e$\Websites\nodejs\trifolia-fhir"
$serverPath = "E:\Websites\nodejs\trifolia-fhir"
#$credentials = Get-Credential -UserName "sean.mcilvenna@lantanagroup.com" -Message "Please enter your password"

If(!(test-path ".\dist\")) {
      New-Item -ItemType Directory -Force -Path ".\dist\"
}

# zip server files
$serverIncludes = @("controllers\*", "src\assets\stu3\*")
$serverExcludes = @(".angular-cli.json", ".gitignore", "gulpfile.js", "help.hnd", "karma.conf.js", "package-lock.json", "protractor.conf.js", "TrifoliaFhir.sln", "tsconfig.json", "tslint.json")
$serverExcludes += "org.hl7.fhir.igpublisher.jar"
[array]$serverFilesToZip = Get-ChildItem .\* -Exclude $serverExcludes -File
$serverFilesToZip += $serverIncludes | ForEach{Get-ChildItem .\$_ -Exclude $serverExcludes -File}
$serverFilesToZip | Write-Zip -EntryPathRoot $(Resolve-Path .\|Select -Expand Path) -OutputPath ".\dist\server.zip"

# zip client files
$clientIncludes = @("wwwroot\assets\*", "wwwroot\assets\stu3\*", "wwwroot\help\*")
$clientExcludes = @()
$clientExcludes += "org.hl7.fhir.igpublisher.jar"
[array]$clientFilesToZip = Get-ChildItem .\wwwroot\* -Exclude $clientExcludes -File
$clientFilesToZip += $clientIncludes | ForEach{Get-ChildItem .\$_ -Exclude $clientExcludes -File}
$clientFilesToZip | Write-Zip -EntryPathRoot $(Resolve-Path .\wwwroot\|Select -Expand Path) -OutputPath ".\dist\client.zip"

# copy files to server
Copy-Item -Path ".\dist\server.zip" -Destination "$remotePath\server.zip"
Copy-Item -Path ".\dist\client.zip" -Destination "$remotePath\wwwroot\client.zip"
Copy-Item -Path ".\tools\installPackages.ps1" -Destination "$remotePath\installPackages.ps1"

<#
# extract the files onto the server
$scriptBlock = {
    [System.IO.Compression.ZipFile]::ExtractToDirectory("E:\Websites\nodejs\trifolia-fhir\server.zip", "E:\Websites\nodejs\trifolia-fhir\")
    [System.IO.Compression.ZipFile]::ExtractToDirectory("E:\Websites\nodejs\trifolia-fhir\wwwroot\client.zip", "E:\Websites\nodejs\trifolia-fhir\wwwroot\")
}

Invoke-Command -ComputerName $server -Credential $credentials -ScriptBlock $scriptBlock -UseSSL
#>