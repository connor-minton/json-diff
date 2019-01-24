# json-diff

Shows the difference between two JSON files.

Plain text diffs tend to be insufficient to compare JSON files, because
equivalent JSON objects can list their keys in different orders, as well as have
different whitespace and formatting.  `json-diff` outputs a diff that ignores
textual differences like these and simply compares JSONs.


## Install

```
npm i -g @cminton/json-diff
```


## Usage

```
json-diff file1 file2
```
