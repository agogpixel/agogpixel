#!/bin/bash

set -o errexit
set -o pipefail
set -o noclobber
set -o nounset
#set -o xtrace

source ./shared-lib.sh

################################################################################
# Readonly Settings
################################################################################

readonly BATS_INSTALLER_DEFAULT_BATS_CORE_VERSION=1.2.1

readonly BATS_INSTALLER_DEFAULT_BATS_SUPPORT_VERSION=0.3.0

readonly BATS_INSTALLER_DEFAULT_BATS_ASSERT_VERSION=2.0.0

readonly BATS_INSTALLER_DEFAULT_BATS_FILE_VERSION=0.3.0

readonly BATS_INSTALLER_DEFAULT_BATS_DETIK_VERSION=1.0.0

readonly BATS_INSTALLER_INSTALL_PATH=/opt/bats-core

################################################################################
# Runtime Settings
################################################################################

BATS_INSTALLER_BATS_CORE_VERSION="${BATS_INSTALLER_DEFAULT_BATS_CORE_VERSION}"

BATS_INSTALLER_BATS_SUPPORT_VERSION="${BATS_INSTALLER_DEFAULT_BATS_SUPPORT_VERSION}"

BATS_INSTALLER_BATS_ASSERT_VERSION="${BATS_INSTALLER_DEFAULT_BATS_ASSERT_VERSION}"

BATS_INSTALLER_BATS_FILE_VERSION="${BATS_INSTALLER_DEFAULT_BATS_FILE_VERSION}"

BATS_INSTALLER_BATS_DETIK_VERSION="${BATS_INSTALLER_DEFAULT_BATS_DETIK_VERSION}"

################################################################################
# Options
################################################################################

# Print help.
declare -A BATS_INSTALLER_OPT_HELP=([NAME]=help [LONG]=help [SHORT]=h)

# bats-core version.
declare -A BATS_INSTALLER_OPT_BATS_CORE_VERSION=([NAME]=bats-core-version [LONG]=core [SHORT]=c)

# bats-support version.
declare -A BATS_INSTALLER_OPT_BATS_SUPPORT_VERSION=([NAME]=bats-support-version [LONG]=support [SHORT]=s)

# bats-assert version.
declare -A BATS_INSTALLER_OPT_BATS_ASSERT_VERSION=([NAME]=bats-assert-version [LONG]=assert [SHORT]=a)

# bats-file version.
declare -A BATS_INSTALLER_OPT_BATS_FILE_VERSION=([NAME]=bats-file-version [LONG]=file [SHORT]=f)

# bats-detik version.
declare -A BATS_INSTALLER_OPT_BATS_DETIK_VERSION=([NAME]=bats-detik-version [LONG]=detik [SHORT]=d)

################################################################################
# Functions
################################################################################

bats_installer_main() {
  bats_installer_parse_args ${@}

  bats_installer_print_header
  bats_installer_install_releases
}

bats_installer_parse_args() {
  # Options parsing.
  local opts="${BATS_INSTALLER_OPT_HELP[SHORT]}${BATS_INSTALLER_OPT_BATS_CORE_VERSION[SHORT]}:${BATS_INSTALLER_OPT_BATS_SUPPORT_VERSION[SHORT]}:${BATS_INSTALLER_OPT_BATS_ASSERT_VERSION[SHORT]}:${BATS_INSTALLER_OPT_BATS_FILE_VERSION[SHORT]}:${BATS_INSTALLER_OPT_BATS_DETIK_VERSION[SHORT]}:"
  local longopts="${BATS_INSTALLER_OPT_HELP[LONG]},${BATS_INSTALLER_OPT_BATS_CORE_VERSION[LONG]}:,${BATS_INSTALLER_OPT_BATS_SUPPORT_VERSION[LONG]}:,${BATS_INSTALLER_OPT_BATS_ASSERT_VERSION[LONG]}:,${BATS_INSTALLER_OPT_BATS_FILE_VERSION[LONG]}:,${BATS_INSTALLER_OPT_BATS_DETIK_VERSION[LONG]}:"

  ! PARSED=$(getopt --options=${opts} --longoptions=${longopts} --name "${0}" -- "${@}")

  if [[ ${PIPESTATUS[0]} -ne 0 ]]; then
    # getopt has complained about wrong arguments to stdout.
    bats_installer_print_usage
    exit 1
  fi

  # Handle quoting in getopt output.
  eval set -- "${PARSED}"

  while true; do
    case "$1" in
      "-${BATS_INSTALLER_OPT_HELP[SHORT]}"|"--${BATS_INSTALLER_OPT_HELP[LONG]}")
        bats_installer_print_help
        exit 0
        ;;
      "-${BATS_INSTALLER_OPT_BATS_CORE_VERSION[SHORT]}"|"--${BATS_INSTALLER_OPT_BATS_CORE_VERSION[LONG]}")
        BATS_INSTALLER_BATS_CORE_VERSION="${2}"
        shift 2
        ;;
      "-${BATS_INSTALLER_OPT_BATS_SUPPORT_VERSION[SHORT]}"|"--${BATS_INSTALLER_OPT_BATS_SUPPORT_VERSION[LONG]}")
        BATS_INSTALLER_BATS_SUPPORT_VERSION="${2}"
        shift 2
        ;;
      "-${BATS_INSTALLER_OPT_BATS_ASSERT_VERSION[SHORT]}"|"--${BATS_INSTALLER_OPT_BATS_ASSERT_VERSION[LONG]}")
        BATS_INSTALLER_BATS_ASSERT_VERSION="${2}"
        shift 2
        ;;
      "-${BATS_INSTALLER_OPT_BATS_FILE_VERSION[SHORT]}"|"--${BATS_INSTALLER_OPT_BATS_FILE_VERSION[LONG]}")
        BATS_INSTALLER_BATS_FILE_VERSION="${2}"
        shift 2
        ;;
      "-${BATS_INSTALLER_OPT_BATS_DETIK_VERSION[SHORT]}"|"--${BATS_INSTALLER_OPT_BATS_DETIK_VERSION[LONG]}")
        BATS_INSTALLER_BATS_DETIK_VERSION="${2}"
        shift 2
        ;;
      --)
        shift
        break
        ;;
    esac
  done

  # Arguments parsing.
  if [ "${#}" -ne 0 ]; then
    bats_installer_print_usage
    exit 2
  fi
}

bats_installer_print_usage() {
  cat <<EOF
Usage:
  $0 [-${BATS_INSTALLER_OPT_BATS_CORE_VERSION[SHORT]} <bats-core-version>] [-${BATS_INSTALLER_OPT_BATS_SUPPORT_VERSION[SHORT]} <bats-support-version>] [-${BATS_INSTALLER_OPT_BATS_ASSERT_VERSION[SHORT]} <bats-assert-version>] [-${BATS_INSTALLER_OPT_BATS_FILE_VERSION[SHORT]} <bats-file-version>] [-${BATS_INSTALLER_OPT_BATS_DETIK_VERSION[SHORT]} <bats-detik-version>]
  $0 [-${BATS_INSTALLER_OPT_HELP[SHORT]}]

  Installs to '${BATS_INSTALLER_INSTALL_PATH}'. Requires curl & tar to already be installed.

  -${BATS_INSTALLER_OPT_BATS_CORE_VERSION[SHORT]}, --${BATS_INSTALLER_OPT_BATS_CORE_VERSION[LONG]}
    Specify bats-core version. Default is '${BATS_INSTALLER_DEFAULT_BATS_CORE_VERSION}'.

  -${BATS_INSTALLER_OPT_BATS_SUPPORT_VERSION[SHORT]}, --${BATS_INSTALLER_OPT_BATS_SUPPORT_VERSION[LONG]}
    Specify bats-support version. Default is '${BATS_INSTALLER_DEFAULT_BATS_SUPPORT_VERSION}'.

  -${BATS_INSTALLER_OPT_BATS_ASSERT_VERSION[SHORT]}, --${BATS_INSTALLER_OPT_BATS_ASSERT_VERSION[LONG]}
    Specify bats-assert version. Default is '${BATS_INSTALLER_DEFAULT_BATS_ASSERT_VERSION}'.

  -${BATS_INSTALLER_OPT_BATS_FILE_VERSION[SHORT]}, --${BATS_INSTALLER_OPT_BATS_FILE_VERSION[LONG]}
    Specify bats-file version. Default is '${BATS_INSTALLER_DEFAULT_BATS_FILE_VERSION}'.

  -${BATS_INSTALLER_OPT_BATS_DETIK_VERSION[SHORT]}, --${BATS_INSTALLER_OPT_BATS_DETIK_VERSION[LONG]}
    Specify bats-detik version. Default is '${BATS_INSTALLER_DEFAULT_BATS_DETIK_VERSION}'.

  -${BATS_INSTALLER_OPT_HELP[SHORT]}, --${BATS_INSTALLER_OPT_HELP[LONG]}
    Print help information.
EOF
}

bats_installer_print_help() {
  printf '\nAdd BATS (BASH Automated Test System) to image.\n\n'
  bats_installer_print_usage
}

bats_installer_print_header() {
  shared_lib_print_header 'BATS (BASH Automated Test System) Installer'
}

bats_installer_install_releases() {
  printf '\nInstalling releases...\n'

  mkdir -p "${BATS_INSTALLER_INSTALL_PATH}"

  bats_installer_install_release bats-core "${BATS_INSTALLER_BATS_CORE_VERSION}"
  bats_installer_install_release bats-support "${BATS_INSTALLER_BATS_SUPPORT_VERSION}"
  bats_installer_install_release bats-assert "${BATS_INSTALLER_BATS_ASSERT_VERSION}"
  bats_installer_install_release bats-file "${BATS_INSTALLER_BATS_FILE_VERSION}"
  bats_installer_install_release bats-detik "${BATS_INSTALLER_BATS_DETIK_VERSION}"

  local bats_bin="${BATS_INSTALLER_INSTALL_PATH}"/bats-core/bin/bats

  chmod 755 "${bats_bin}"
  ln -s "${bats_bin}" /usr/local/bin/bats
}

bats_installer_install_release() {
  local project="${1}"
  local version="${2}"

  curl -L "$(printf 'https://github.com/bats-core/%s/archive/v%s.tar.gz' "${project}" "${version}")" | tar xz
  mv "${project}"-"${version}" "${BATS_INSTALLER_INSTALL_PATH}"/"${project}"
}

################################################################################
# Program Entry
################################################################################

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  bats_installer_main ${@}
fi
