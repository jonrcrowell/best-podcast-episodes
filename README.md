# Redis Example (with Upstash)

This example showcases how to use Redis as a data store in a Next.js project.

The example is a roadmap voting application where users can enter and vote for feature requests. It features the following:

- Users can add and upvote items (features in the roadmap)
- Users can enter their email addresses to be notified about the released items.
- The API records the ip-addresses of the voters, so it does not allow multiple votes on the same item from the same IP address.

## To Do

- [x] Repurpose for podcasts episodes
- [x] Replace logo
- [ ] Create better components for episodes
    - include link to episode
    - description
    - genre?
- [ ] Consider removing e-mail, unless I decide to use it for something
- [ ] Turn adding new episode into a form
- [ ] Add tab for Podcasts
- [ ] Add filters
