# The version and sha256 lines are rewritten by scripts/release.sh in the source repo.
class Beatcode < Formula
  desc "Rhythm game for the terminal where the notes are the tokens of real source code"
  homepage "https://github.com/yukihirop/beatcode"
  version "0.1.0"
  license :cannot_represent

  on_macos do
    on_arm do
      url "https://github.com/yukihirop/beatcode/releases/download/v#{version}/beatcode-aarch64-apple-darwin.tar.gz"
      sha256 "0000000000000000000000000000000000000000000000000000000000000000"
    end
    on_intel do
      url "https://github.com/yukihirop/beatcode/releases/download/v#{version}/beatcode-x86_64-apple-darwin.tar.gz"
      sha256 "0000000000000000000000000000000000000000000000000000000000000000"
    end
  end

  depends_on :macos

  def install
    bin.install "beatcode"
  end

  test do
    assert_match version.to_s, shell_output("#{bin}/beatcode --version")
  end
end
