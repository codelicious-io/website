Public codelicious.io site
======

To view locally, run this in the checked out project root:

```
python -m SimpleHTTPServer 8000
```

Now go to http://localhost:8000.


To deploy to codelicious.io:

```
s3cmd sync --acl-public --exclude '.git/*' --exclude '.idea/*' --exclude '.DS_Store' . s3://www.codelicious.io
```

PS: You'll need a Talis AWS key and secret. If you don't work for Talis, ask a Talisian to deploy.