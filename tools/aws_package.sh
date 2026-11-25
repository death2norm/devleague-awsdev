#!/bin/bash
# AWS Developer: build one session package with its lab files.
#   tools/aws_package.sh NN [LAB DEBRIEF]
# The kit's rebuild.sh copies src/*_SNN* into _build without -r, so a lab folder (src/lab_SNN/) would stop it.
# This wrapper moves the folder aside, runs rebuild.sh, then adds AWSDev_SNN_LabFiles.zip (the starter scripts and
# JSON files, without node_modules) to out/Student, the package's Student folder and _build, and re-zips the package.
set -e
n=$1; shift || true
cd "${WORKSPACE:-$(cd "$(dirname "$0")/.." && pwd)}"
set -a; . ./course.env; set +a
L=src/lab_S$n; T=${TMPDIR_BUILD:-/tmp/claude-0}/lab_S$n; mkdir -p "$(dirname $T)"
restore() { [ -d "$T" ] && { rm -rf "$L"; mv "$T" "$L"; }; true; }
if [ -d "$L" ]; then rm -rf "$T"; mv "$L" "$T"; trap restore EXIT; fi
tools/rebuild.sh $n "$@"
restore; trap - EXIT
[ -d "$L" ] || exit 0
Z=out/Student/${PREFIX}_S${n}_LabFiles.zip; rm -f $Z
(cd src && zip -qr ../$Z lab_S$n -x "*/node_modules/*" "*/package-lock.json")
cp $Z pkg$n/Student/; rm -rf pkg$n/_build/lab_S$n; cp -r $L pkg$n/_build/; rm -rf pkg$n/_build/lab_S$n/node_modules
rm -f ${PREFIX}_S${n}_Package.zip; (cd pkg$n && zip -qr ../${PREFIX}_S${n}_Package.zip .)
echo "S$n lab files: $Z ($(unzip -l $Z | tail -1 | awk '{print $2}') files) added to ${PREFIX}_S${n}_Package.zip"
