# The version and sha256 lines are rewritten by scripts/release.sh in the source repo.
class Beatcode < Formula
  desc "Rhythm game for the terminal where the notes are the tokens of real source code"
  homepage "https://beatcode.run"
  version "0.1.1"
  license :cannot_represent

  on_macos do
    on_arm do
      url "https://github.com/yukihirop/beatcode/releases/download/v#{version}/beatcode-aarch64-apple-darwin.tar.gz"
      sha256 "6576b3b313e492b9dba0470616a3a571eb5d64e5f463be23f5060f9c4c1652ce"
    end
    on_intel do
      url "https://github.com/yukihirop/beatcode/releases/download/v#{version}/beatcode-x86_64-apple-darwin.tar.gz"
      sha256 "6775d920b8cd9cf7ee939bba17c089d897c49743956b420a9805f676d578054f"
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
