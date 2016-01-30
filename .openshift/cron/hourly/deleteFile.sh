#! /bin/bash
find /var/lib/openshift/56a512872d5271b7ec0000f1/app-root/data/public/ -daystart -maxdepth 1 -mmin +59 -type f -name "*.jpg" -exec rm -f {} \;
