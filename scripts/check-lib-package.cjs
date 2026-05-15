const fs = require('fs');
const path = require('path');

const libPackagePath = path.join(
  process.cwd(),
  'projects',
  'pl-core-utils-library',
  'package.json'
);

const ngPackagePath = path.join(
  process.cwd(),
  'projects',
  'pl-core-utils-library',
  'ng-package.json'
);

const libPackage = JSON.parse(fs.readFileSync(libPackagePath, 'utf8'));
const ngPackage = JSON.parse(fs.readFileSync(ngPackagePath, 'utf8'));

const requiredPeerDependencies = [
  '@angular/common',
  '@angular/core',
  '@angular/forms',
  '@angular/router',
  '@ng-bootstrap/ng-bootstrap',
  '@ngx-translate/http-loader',
  'bootstrap',
  'ngx-ui-loader',
  'pl-decorator',
  'rxjs'
];

const allowedNonPeerDependencies = ngPackage.allowedNonPeerDependencies || [];

const errors = [];

if (!libPackage.name) {
  errors.push('Missing package name');
}

if (!libPackage.version) {
  errors.push('Missing package version');
}

if (!libPackage.peerDependencies) {
  errors.push('Missing peerDependencies');
}

for (const dependency of requiredPeerDependencies) {
  if (!libPackage.peerDependencies?.[dependency]) {
    errors.push(`Missing peerDependency: ${dependency}`);
  }
}

if (!libPackage.dependencies?.tslib) {
  errors.push('Missing dependency: tslib');
}

if (!libPackage.dependencies?.['html-to-image']) {
  errors.push('Missing dependency: html-to-image');
}

if (!libPackage.dependencies?.html2canvas) {
  errors.push('Missing dependency: html2canvas');
}

for (const dependency of ['html-to-image', 'html2canvas']) {
  if (!allowedNonPeerDependencies.includes(dependency)) {
    errors.push(`Missing allowedNonPeerDependency: ${dependency}`);
  }
}

const forbiddenDependencies = [
  '@angular/core',
  '@angular/common',
  '@angular/forms',
  '@angular/router',
  'jquery',
  'moment',
  'popper.js',
  'angular2-uuid',
  '@fortawesome/fontawesome-free'
];

for (const dependency of forbiddenDependencies) {
  if (libPackage.dependencies?.[dependency]) {
    errors.push(`Forbidden runtime dependency in library package: ${dependency}`);
  }
}

if (errors.length > 0) {
  console.error('\nLibrary package check failed:\n');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log('Library package check passed.');