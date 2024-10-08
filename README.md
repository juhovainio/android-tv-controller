# Android TV/Projector Controller

## Set-up
1. Run `npm install`
2. Create .env file that contains the IP of the TV device (`ANDROID_TV_IP`)
3. Start the application with `node index.js`
4. Pair the device
    - During the first launch, you will be prompted to enter the pairing code shown on the TV/Projector to the terminal, this will generate a certificate and a private key, and store them in the application directory into cert.pem and key.pem files
    - After the certificates have been generated once, consecutive runs will not require a pairing code