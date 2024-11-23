with import <nixpkgs> { };
let
  pythonPackages = python3Packages;
in pkgs.mkShell rec {
  name = "booksEnv";
  buildInputs = [
    pythonPackages.mistune
    pythonPackages.python-frontmatter
    pythonPackages.beautifulsoup4
    pythonPackages.ipykernel
  ];
}
