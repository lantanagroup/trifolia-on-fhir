##
## Requires the Pscx module
## Install-Module Pscx -Allowclobber
##

Param(
  [switch] $NoPackage = $false,
  [switch] $NoCopy = $false,
  [switch] $IncludePublisher = $false,
  [string] $Server = "dev7.lantanagroup.com",
  [string] $ServerPath = "E:\Websites\nodejs\trifolia-fhir",
  [string] $CopyPath = "\\dev7\e$\Websites\nodejs\trifolia-fhir",
  [string] $Username = "sean.mcilvenna@lantanagroup.com"
)

#$credentials = Get-Credential -UserName $Username -Message "Please enter your password"

If(!(test-path ".\dist\")) {
      New-Item -ItemType Directory -Force -Path ".\dist\"
}

If ($NoPackage -ne $true) {
	# zip server files
	$serverIncludes = @("controllers\*", "src\assets\stu3\*", "src\assets\stu3\extensions\*", "src\assets\r4\*", "src\assets\r4\extensions\*", "config\*", "ig-publisher\*")
	$serverExcludes = @(".angular-cli.json", ".gitignore", "gulpfile.js", "help.hnd", "karma.conf.js", "package-lock.json", "protractor.conf.js", "TrifoliaFhir.sln", "tsconfig.json", "tslint.json")

	If ($IncludePublisher -ne $true) {
	    $serverExcludes += "org.hl7.fhir.igpublisher.jar"
	}

	[array]$serverFilesToZip = Get-ChildItem .\* -Exclude $serverExcludes -File
	$serverFilesToZip += $serverIncludes | ForEach{Get-ChildItem .\$_ -Exclude $serverExcludes -File}
	$serverFilesToZip | Write-Zip -EntryPathRoot $(Resolve-Path .\|Select -Expand Path) -OutputPath ".\dist\server.zip"

	# zip client files
	$clientIncludes = @("wwwroot\assets\*", "wwwroot\assets\stu3\*", "wwwroot\assets\r4\*", "wwwroot\help\*")
	$clientExcludes = @()
	$clientExcludes += "org.hl7.fhir.igpublisher.jar"
	[array]$clientFilesToZip = Get-ChildItem .\wwwroot\* -Exclude $clientExcludes -File
	$clientFilesToZip += $clientIncludes | ForEach{Get-ChildItem .\$_ -Exclude $clientExcludes -File}
	$clientFilesToZip | Write-Zip -EntryPathRoot $(Resolve-Path .\wwwroot\|Select -Expand Path) -OutputPath ".\dist\client.zip"
}

If ($NoCopy -ne $true) {
	# copy files to server
	Copy-Item -Path ".\dist\server.zip" -Destination "$CopyPath\server.zip"
	Copy-Item -Path ".\dist\client.zip" -Destination "$CopyPath\wwwroot\client.zip"
	Copy-Item -Path ".\tools\installPackages.ps1" -Destination "$CopyPath\installPackages.ps1"
}

<#
# extract the files onto the server
$scriptBlock = {
	# TODO: Use $ServerPath
    [System.IO.Compression.ZipFile]::ExtractToDirectory("E:\Websites\nodejs\trifolia-fhir\server.zip", "E:\Websites\nodejs\trifolia-fhir\")
    [System.IO.Compression.ZipFile]::ExtractToDirectory("E:\Websites\nodejs\trifolia-fhir\wwwroot\client.zip", "E:\Websites\nodejs\trifolia-fhir\wwwroot\")
}

Invoke-Command -ComputerName $Server -Credential $credentials -ScriptBlock $scriptBlock -UseSSL
#>