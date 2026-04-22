## Description

**Fixes #<issue_number_goes_here>**

> _It's a good idea to open an issue first for discussion before submitting a PR._

## Checklist

- [ ] CI Build & Type-check Tests Pass
- [ ] CodeQL All Tests Pass
- [ ] README/Docs updated if needed
- [ ] No breaking changes (or described below)

---

## How to Test This PR

You have two options to test these changes live:

### Option A: Test on your existing self-hosted instance (Recommended)

If you already have a WaiChat instance running on Cloudflare, you can test this PR without losing your database history:

1. Go to the **Actions** tab of your own WaiChat repository.
2. Select the **Dev: Test Upstream Branch** workflow.
3. Click **Run workflow** and enter `BRANCH_NAME` (the author's branch) into the input field.

### Option B: 1-Click Fresh Deployment

Want to test these changes on a brand new, isolated Cloudflare instance? Use the button below.

> **PR Author:** Before opening this PR, please ensure you replace `BRANCH_NAME` in the URL below with the actual name of your branch!

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/ranajahanzaib/WaiChat/tree/BRANCH_NAME)
