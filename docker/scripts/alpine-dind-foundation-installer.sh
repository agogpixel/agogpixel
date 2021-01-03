#!/bin/bash

set -o errexit
set -o pipefail
set -o noclobber
set -o nounset
#set -o xtrace

source ./shared-lib.sh
source ./shared-alpine-lib.sh

################################################################################
# Runtime Settings
################################################################################

ALPINE_DIND_FOUNDATION_INSTALLER_ALPINE_VERSION=

ALPINE_DIND_FOUNDATION_INSTALLER_USERNAME=root

ALPINE_DIND_FOUNDATION_INSTALLER_INSTALL_DOCKER_COMPOSE=false

################################################################################
# Options
################################################################################

# Print help.
declare -A ALPINE_DIND_FOUNDATION_INSTALLER_OPT_HELP=([NAME]=help [LONG]=help [SHORT]=h)

# Username.
declare -A ALPINE_DIND_FOUNDATION_INSTALLER_OPT_USERNAME=([NAME]=username [LONG]=username [SHORT]=u)

# Install docker-compose?
declare -A ALPINE_DIND_FOUNDATION_INSTALLER_OPT_INSTALL_DOCKER_COMPOSE=([NAME]=install-docker-compose [LONG]=docker-compose [SHORT]=c)

################################################################################
# Functions
################################################################################

alpine_dind_foundation_installer_main() {
  alpine_dind_foundation_installer_parse_args ${@}

  alpine_dind_foundation_installer_print_header
  alpine_dind_foundation_installer_install_packages
  alpine_dind_foundation_installer_setup_users
  alpine_dind_foundation_installer_setup_init
}

alpine_dind_foundation_installer_parse_args() {
  # Options parsing.
  local opts="${ALPINE_DIND_FOUNDATION_INSTALLER_OPT_HELP[SHORT]}${ALPINE_DIND_FOUNDATION_INSTALLER_OPT_USERNAME[SHORT]}${ALPINE_DIND_FOUNDATION_INSTALLER_OPT_INSTALL_DOCKER_COMPOSE[SHORT]}"
  local longopts="${ALPINE_DIND_FOUNDATION_INSTALLER_OPT_HELP[LONG]},${ALPINE_DIND_FOUNDATION_INSTALLER_OPT_USERNAME[SHORT]}:,${ALPINE_DIND_FOUNDATION_INSTALLER_OPT_INSTALL_DOCKER_COMPOSE[LONG]}"

  ! PARSED=$(getopt --options=${opts} --longoptions=${longopts} --name "${0}" -- "${@}")

  if [[ ${PIPESTATUS[0]} -ne 0 ]]; then
    # getopt has complained about wrong arguments to stdout.
    alpine_dind_foundation_installer_print_usage
    exit 1
  fi

  # Handle quoting in getopt output.
  eval set -- "${PARSED}"

  while true; do
    case "$1" in
      "-${ALPINE_DIND_FOUNDATION_INSTALLER_OPT_HELP[SHORT]}"|"--${ALPINE_DIND_FOUNDATION_INSTALLER_OPT_HELP[LONG]}")
        alpine_dind_foundation_installer_print_help
        exit 0
        ;;
      "-${ALPINE_DIND_FOUNDATION_INSTALLER_OPT_USERNAME[SHORT]}"|"--${ALPINE_DIND_FOUNDATION_INSTALLER_OPT_USERNAME[LONG]}")
        ALPINE_DIND_FOUNDATION_INSTALLER_USERNAME="${2}"
        shift 2
        ;;
      "-${ALPINE_DIND_FOUNDATION_INSTALLER_OPT_INSTALL_DOCKER_COMPOSE[SHORT]}"|"--${ALPINE_DIND_FOUNDATION_INSTALLER_OPT_INSTALL_DOCKER_COMPOSE[LONG]}")
        ALPINE_DIND_FOUNDATION_INSTALLER_INSTALL_DOCKER_COMPOSE=true
        shift
        ;;
      --)
        shift
        break
        ;;
    esac
  done

  # Arguments parsing.
  if [ "${#}" -ne 1 ]; then
    alpine_dind_foundation_installer_print_usage
    exit 2
  fi

  ALPINE_DIND_FOUNDATION_INSTALLER_ALPINE_VERSION="${1}"
}

alpine_dind_foundation_installer_print_usage() {
  cat <<EOF
Usage:
  $0 [-${ALPINE_DIND_FOUNDATION_INSTALLER_OPT_USERNAME[SHORT]} <username>] [-${ALPINE_DIND_FOUNDATION_INSTALLER_OPT_INSTALL_DOCKER_COMPOSE[SHORT]}] <variant>
  $0 [-${ALPINE_DIND_FOUNDATION_INSTALLER_OPT_HELP[SHORT]}]

  Installs docker, enables user access, and adds dockerd service to init
  system. If no user is specified, access defaults to root user only.

  Variant argument must be an alpine docker tag of the form 'x.y' or 'edge'.

  Resulting container must run with: --privileged

  Note that the storage driver used for dockerd is dependent on available host
  system kernel modules. See also:
  https://github.com/docker/docker-ce/blob/master/components/engine/daemon/graphdriver/driver_linux.go#L53

  -${ALPINE_DIND_FOUNDATION_INSTALLER_OPT_USERNAME[SHORT]} <username>, --${ALPINE_DIND_FOUNDATION_INSTALLER_OPT_USERNAME[LONG]} <username>
    Allow non-root user access to docker for specified username.

  -${ALPINE_DIND_FOUNDATION_INSTALLER_OPT_INSTALL_DOCKER_COMPOSE[SHORT]}, --${ALPINE_DIND_FOUNDATION_INSTALLER_OPT_INSTALL_DOCKER_COMPOSE[LONG]}
    Install docker-compose along with docker.

  -${ALPINE_DIND_FOUNDATION_INSTALLER_OPT_HELP[SHORT]}, --${ALPINE_DIND_FOUNDATION_INSTALLER_OPT_HELP[LONG]}
    Print help information.
EOF
}

alpine_dind_foundation_installer_print_help() {
  printf '\nInstall docker-in-docker foundation to alpine-foundation based image.\n\n'
  alpine_dind_foundation_installer_print_usage
}

alpine_dind_foundation_installer_print_header() {
  shared_lib_print_header 'Alpine Docker-In-Docker Foundation Installer'
}

alpine_dind_foundation_installer_install_packages() {
  printf '\nInstalling packages...\n'
  shared_alpine_lib_install_docker_packages "${ALPINE_DIND_FOUNDATION_INSTALLER_INSTALL_DOCKER_COMPOSE}"
}

alpine_dind_foundation_installer_setup_users() {
  printf '\nSetting up users...\n'
  shared_alpine_lib_setup_docker_users "${ALPINE_DIND_FOUNDATION_INSTALLER_USERNAME}"
}

alpine_dind_foundation_installer_setup_init() {
  printf "\nSetting up docker...\n"

  local sv_path=/etc/sv/dockerd
  local sv_run_path="${sv_path}"/run

  mkdir -p "${sv_path}"

  cat > "${sv_run_path}" <<- EOF
#!/bin/sh
exec 2>&1
exec /usr/bin/dockerd
EOF

  chmod +x "${sv_run_path}"
  ln -s "${sv_path}" /etc/service/dockerd
}

################################################################################
# Program Entry
################################################################################

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  alpine_dind_foundation_installer_main ${@}
fi
