# mes-tars-load-injector

An application to periodically change data in the TARS database. Used to test Changed Data Capture on AWS Data Migration Service.

## Pre-requisites

* Node (v10.15.x - specified by `nvmrc`, do `nvm use`)
* npm (v6.4.x)
* Security
  * [Git secrets](https://github.com/awslabs/git-secrets)
  * [ScanRepo](https://github.com/UKHomeOffice/repo-security-scanner)
* TARS Oracle database running in AWS with public IP and VPN in security group.
* Oracle Instant Client (64-bit basic lite) installed on laptop - see [download link](http://www.oracle.com/technetwork/topics/intel-macsoft-096467.html)
  * Unzip it in your home directory, create a `~/lib` directory, and create the following links:
    * `ln -s ~/instantclient_12_2/libclntsh.dylib ~/lib`
    * `ln -s ~/instantclient_12_2/libclntsh.dylib.12.1 ~/lib`

## Running the load injector

* Create a `.env` file like the following:

```text
CONNECTION_STRING=<oracle_hostname>:<oracle_port>/<oracle_sid>
USERNAME=<oracle_username>
PASSWORD=<oracle_password>
```

* Start the application

```shell
npm start
```

## Configuration

### Modify change rate

You can change the rate at which database modifications are made.
To do this, add the `CHANGES_PER_MINUTE` key to your `.env` file.

```properties
CHANGES_PER_MINUTE=60 # One change every second
```
