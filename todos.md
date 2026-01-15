# List of todo items for the code

- [ ] Make sure we can access onboarding routes only when we have the right starting page. Now, you can still access it even though you have already finished the onboarding.

- [ ] There is a bug on the "Callback" page, which triggers the "renewToken" in "Auth.js" and throws an error "unauthorized". There must be a race condition somewhere.

- [ ] Add a script to the popups which would get closed after success from backend. Example of the script:

```javascript
<script language="javascript" type="text/javascript">
  window.close("");
</script>
```

- [ ] We get an error when fetching "startPage" and the team from the local storage is not available for the newly logged in user. We probably have a case when we log out but don't remove the `selectedTeam` from localStorage.

- [ ] We are getting an error on the `http://localhost:3000/campaigns?filter=completed` route. Probably some small silly mistake. `Warning: validateDOMNesting(...): <div> cannot appear as a descendant of <p>.`

- [ ] Dashboard error. Most likely some race condition. Should be simple fix once we figure out where its happening. `Warning: Cannot update during an existing state transition (such as within`render`). Render methods should be a pure function of props and state.`

- [ ] Export the "TOPBAR" into a separate component which mounts on the layout layer instead of on each route. We are breaking the layout with the "lazy loading" + we are re-rendering it over and over. Meaning, for the "Notifications" we would refetch over and over. This will require figuring a nice API to be able to render different buttons in the topbar based on the route without re-rendering things too much. Maybe need to use React Router routes in it. Though I don't like that approach.

- [ ] There are some cases when we get `TypeError: Cannot read property 'timestamp' of undefined` on hovering over the graph. Mostly on the compare page

- [ ] We have a bug on the "Graph Tooltip" when if we move mouse away from the graph and then move the mouse back but we hover over the same timestamp, we don't get the tooltip. There is a bug which doesn't render it until new data for the tooltip is loaded.

- [ ] Figure out how to reduce the core bundle from "2.7 MB" to something much smaller. Not sure why it's happening like that.

---

- [ ] Looks like when the token expires, we don't remove the "teamId" from local storage and the next time it blows up.

- [] trigger ci 1