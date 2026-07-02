# GitHub Pages custom domain setup

This repository is configured for:

```text
getdeclarix.com
```

The GitHub Pages site is `cleanerbeybe/declarix-site`, published by the Pages workflow from the `dist` artifact. The real CNAME file lives at `public/CNAME` so Vite copies it into `dist/CNAME`.

In GoDaddy DNS, remove the default apex records that point to GoDaddy Website Builder, then add these records.

For the apex domain:

```text
@  A  185.199.108.153
@  A  185.199.109.153
@  A  185.199.110.153
@  A  185.199.111.153
```

For the `www` subdomain:

```text
www  CNAME  cleanerbeybe.github.io
```

Optional IPv6 records:

```text
@  AAAA  2606:50c0:8000::153
@  AAAA  2606:50c0:8001::153
@  AAAA  2606:50c0:8002::153
@  AAAA  2606:50c0:8003::153
```

After DNS propagates, enable **Enforce HTTPS** in GitHub repository settings under **Pages**.
