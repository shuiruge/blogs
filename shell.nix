with (import <nixpkgs> {});
mkShell {
  buildInputs = [
    ruby
    bundler
    jekyll
  ];
}
