#!/bin/bash
set -e
R=$(cd "$(dirname "$0")" && pwd)
for K in "$R/kit" "$R/../devleague-course-kit"; do [ -x "$K/setup.sh" ] && exec "$K/setup.sh" "$R"; done
echo "Course kit not found: attach and clone death2norm/devleague-course-kit next to this repo"; exit 1
