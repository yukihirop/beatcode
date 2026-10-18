#!/bin/sh
# Install beatcode from GitHub Releases.
#
#   curl -fsSL https://beatcode.run/install.sh | sh
#
# Environment:
#   BEATCODE_VERSION      version to install, e.g. 0.1.0 (default: the latest release)
#   BEATCODE_INSTALL_DIR  where to put the binary (default: ~/.local/bin)
#   BEATCODE_DOWNLOAD_URL base URL of the release files (default: GitHub Releases; for testing)
set -eu

repo="yukihirop/beatcode"
install_dir="${BEATCODE_INSTALL_DIR:-$HOME/.local/bin}"

say() { printf '%s\n' "$*"; }
fail() { printf 'beatcode install: %s\n' "$*" >&2; exit 1; }

case "$(uname -s)" in
  Darwin) os="apple-darwin" ;;
  Linux) os="unknown-linux-gnu" ;;
  *) fail "only macOS and Linux are supported (got $(uname -s))" ;;
esac
case "$(uname -m)" in
  arm64 | aarch64) target="aarch64-$os" ;;
  x86_64 | amd64) target="x86_64-$os" ;;
  *) fail "unsupported CPU: $(uname -m)" ;;
esac

if [ -n "${BEATCODE_DOWNLOAD_URL:-}" ]; then
  base="$BEATCODE_DOWNLOAD_URL"
elif [ -n "${BEATCODE_VERSION:-}" ]; then
  base="https://github.com/$repo/releases/download/v${BEATCODE_VERSION#v}"
else
  base="https://github.com/$repo/releases/latest/download"
fi

command -v curl >/dev/null || fail "curl is required"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT INT TERM

archive="beatcode-$target.tar.gz"
say "Downloading $archive"
curl -fsSL "$base/$archive" -o "$tmp/$archive" || fail "could not download $base/$archive"
curl -fsSL "$base/SHA256SUMS" -o "$tmp/SHA256SUMS" || fail "could not download the checksums"

expected="$(awk -v f="$archive" '$2 == f || $2 == "*" f { print $1 }' "$tmp/SHA256SUMS")"
[ -n "$expected" ] || fail "SHA256SUMS has no line for $archive"
if command -v sha256sum >/dev/null; then
  actual="$(sha256sum "$tmp/$archive" | cut -d' ' -f1)"
else
  actual="$(shasum -a 256 "$tmp/$archive" | cut -d' ' -f1)"
fi
[ "$expected" = "$actual" ] || fail "checksum mismatch (expected $expected, got $actual)"

tar -xzf "$tmp/$archive" -C "$tmp"
mkdir -p "$install_dir"
install -m 755 "$tmp/beatcode" "$install_dir/beatcode"
say "Installed $("$install_dir/beatcode" --version) to $install_dir/beatcode"

case ":$PATH:" in
  *":$install_dir:"*) ;;
  *) say "Add $install_dir to your PATH, e.g.: echo 'export PATH=\"$install_dir:\$PATH\"' >> ~/.$(basename "${SHELL:-sh}")rc" ;;
esac
say "Run: beatcode"
