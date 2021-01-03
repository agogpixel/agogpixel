load '/opt/bats-core/bats-support/load.bash'
load '/opt/bats-core/bats-assert/load.bash'

@test "[alpine_foundation_installer_print_usage] Prints usage." {
  skip
  source ./alpine-foundation-installer.sh

  run alpine_foundation_installer_print_usage

  assert_success
  assert_output --partial "Usage:"
}

@test "[alpine_foundation_installer_print_help] Prints help." {
  skip
  source ./alpine-foundation-installer.sh

  run alpine_foundation_installer_print_help

  assert_success
  assert_output --partial "Install foundation to alpine image."
}

@test "[alpine_foundation_installer_parse_args] Prints usage & returns with success when -h option provided." {
  skip
  source ./alpine-foundation-installer.sh

  run alpine_foundation_installer_parse_args -h

  assert_success
  assert_output --partial "Usage:"
}

@test "[alpine_foundation_installer_parse_args] Prints usage & returns with success when --help option provided." {
  skip
  source ./alpine-foundation-installer.sh

  run alpine_foundation_installer_parse_args --help

  assert_success
  assert_output --partial "Usage:"
}

@test "[alpine_foundation_installer_parse_args] Prints usage & returns error code 1 (invalid option)." {
  skip
  source ./alpine-foundation-installer.sh

  run alpine_foundation_installer_parse_args --fail-it

  assert_failure 1
  assert_output --partial "Usage:"
}

@test "[alpine_foundation_installer_main] Prints usage & exits with success when -h option provided." {
  skip
  source ./alpine-foundation-installer.sh

  run alpine_foundation_installer_main -h

  assert_success
  assert_output --partial "Usage:"
}

@test "[alpine_foundation_installer_main] Prints usage & exits with success when --help option provided." {
  skip
  source ./alpine-foundation-installer.sh

  run alpine_foundation_installer_main --help

  assert_success
  assert_output --partial "Usage:"
}

@test "[alpine_foundation_installer_main] Prints usage & exits with error code 1 (invalid option)." {
  skip
  source ./alpine-foundation-installer.sh

  run alpine_foundation_installer_main --fail-it

  assert_failure 1
  assert_output --partial "Usage:"
}
