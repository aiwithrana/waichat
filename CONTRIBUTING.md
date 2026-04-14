# Contributing to WaiChat

We welcome contributions of all kinds to improve this project. We believe in building in public, and we use our [GitHub Project board](https://github.com/users/ranajahanzaib/projects/33) to keep our development process transparent.

## The WaiChat Public Roadmap

All active development, upcoming features, and community-reported bugs flow through the **[WaiChat Public Roadmap](https://github.com/users/ranajahanzaib/projects/33)**.

Navigate through the tabs on the board to see different views of our workflow:

* **Current Sprint:** A Kanban board showing what is actively being worked on right now.
* **Prioritized Backlog:** A ranked list of features and tasks scheduled for upcoming iterations.
* **Roadmap:** A timeline view grouping our planned work by upcoming release milestones.
* **Bug Tracker:** A dedicated list of known issues and confirmed bugs waiting to be squashed.
* **Inbox:** New community ideas, draft notes, feature requests, and unverified reports awaiting triage.

## How to Get Involved

### 1. Find and Claim an Issue
* **Find an issue:** Check the **Bug Tracker** or look for items marked as `To Do` in the **Current Sprint** or **Prioritized Backlog**. Look out for issues tagged with `good first issue` or `help wanted`.
* **Claim it:** Drop a comment on the issue saying you'd like to work on it so we can assign it to you (and avoid duplicate work).

### 2. Fork and Clone
1. **Fork the Repository**: Start by forking the WaiChat repository to your personal GitHub account.
2. **Clone Your Fork**: 
   ```bash
   git clone https://github.com/YOUR-USERNAME/waichat.git
   cd waichat
   ```

### 3. Local Setup
```bash
pnpm install

# Configure your local wrangler file first
cp wrangler.local.toml.example wrangler.local.toml
# Ensure you have a database_id set in wrangler.local.toml

pnpm db:migrate:local    # apply D1 schema locally
pnpm dev:worker          # start Worker on localhost:8787
pnpm dev:client          # start Vite dev server on localhost:5173
```

Add your credentials to `.env.local` for local development:

```bash
CLOUDFLARE_API_TOKEN=your_token_here
CLOUDFLARE_ACCOUNT_ID=your_account_id_here  # optional, for live models
```

*Note: Never commit `.env.local` or `wrangler.local.toml` - they are already in `.gitignore`.*

### 4. Make Your Changes
1. **Create a Branch**: Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature-name
   ```
2. **Make Changes**: Make your changes to the codebase.
3. **Commit Changes**: Commit your changes with a clear and descriptive message:
   ```bash
   git commit -m "feat: add detailed description of the changes"
   ```
4. **Push Changes**: Push your changes to your fork:
   ```bash
   git push origin feature-name
   ```

### 5. Submit a Pull Request
Open a pull request from your branch to the main repository. Include a detailed description of your changes and link the issue it resolves. Participate in the review process, make any requested changes, and your contribution will be merged.

## Guidelines

- Ensure your code follows the existing style and conventions (we use Prettier for formatting).
- Include tests for any new functionality or bug fixes.
- Write clear, concise commit messages and pull request descriptions.
- **Task Complexity:** We use T-shirt sizing (XS, S, M, L, XL) to estimate effort. (e.g., XS = quick typo fix, M = standard feature taking a few days, XL = major architectural change).

## Reporting Issues

Feel free to report bugs or suggest enhancements by creating a new issue. Be sure to include detailed information about the problem and steps to reproduce it. Once submitted, it will land in our [Inbox Board](https://github.com/users/ranajahanzaib/projects/33/views/7) for triage before being added to the prioritized backlog.
