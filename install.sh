#!/bin/sh
# Install beatcode from GitHub Releases.
#
#   curl -fsSL https://raw.githubusercontent.com/yukihirop/beatcode/main/install.sh | sh
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
  Darwin) ;;
  *) fail "only macOS is supported for now (got $(uname -s))" ;;
esac
case "$(uname -m)" in
  arm64 | aarch64) target="aarch64-apple-darwin" ;;
  x86_64) target="x86_64-apple-darwin" ;;
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
curl -fsSL "$base/$archive.sha256" -o "$tmp/$archive.sha256" || fail "could not download the checksum"

expected="$(cut -d' ' -f1 "$tmp/$archive.sha256")"
actual="$(shasum -a 256 "$tmp/$archive" | cut -d' ' -f1)"
[ "$expected" = "$actual" ] || fail "checksum mismatch (expected $expected, got $actual)"

tar -xzf "$tmp/$archive" -C "$tmp"
mkdir -p "$install_dir"
install -m 755 "$tmp/beatcode" "$install_dir/beatcode"
say "Installed $("$install_dir/beatcode" --version) to $install_dir/beatcode"

case ":$PATH:" in
  *":$install_dir:"*) ;;
  *) say "Add $install_dir to your PATH, e.g.: echo 'export PATH=\"$install_dir:\$PATH\"' >> ~/.zshrc" ;;
esac
say "Run: beatcode"
