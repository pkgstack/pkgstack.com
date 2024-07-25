import express from 'express';
import https from 'https';
import { handler as ssrHandler } from './dist/server/entry.mjs';
import * as fs from "fs"

const app = express();


const base = '/';
app.use(base, express.static('dist/client/'));
app.use(ssrHandler);

app.listen(80, function() {
	console.log('Server started on http://localhost:80');
});

const privateKey = fs.readFileSync('/etc/letsencrypt/live/pkgstack.com/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/pkgstack.com/cert.pem', 'utf8');

if (privateKey && certificate) {
	https.createServer({
		key: privateKey,
		cert: certificate
	}, app).listen(443, function() {
		console.log('Server started on https://localhost:443');
	});
} else {
	console.error('No SSL certificate found');
}