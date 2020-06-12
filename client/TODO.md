# Vehicle Maintenance Log

[https://github.com/Usarneme/maint_log_frontend_react]

### Todo

- [ ] Image tagging, indexed for search  
- [ ] Notifications SW  
- [ ] Odometer entry notification - whenever wifi disconnects? Cron job? Interval?  
- [ ] Email service & API url+key  
- [ ] HTML email build and style  
- [ ] HTML and fallback text email tests  
- [ ] Service Manual image to text file, user/client corrections, text file to upcoming/todo Log entries  
- [ ] Integration Test all components  
- [ ] ForgotPassword Component - hook up and test  
- [ ] Vehicle details - images, purchase info, photos of receipts, manual pdf, etc.  
- [ ] Teardown upon log entry, vehicle, and account deletion. IE: images, db collections, sessions/auth, cache.  
- [ ] More useful form validation error handling.  

### In Progress

- [ ] Error Boundaries around all data-changing routes  
- [ ] Unit Test All Components  
- [ ] Unit Test All Pages  
- [ ] Loading component - make animation  

### Done ✓

- [x] Registration -> 1st time Login -> Should prompt w/component on Home page to enter vehicle for new account  
- [x] Currently selected/default vehicle passing to props and components  
- [x] Why is userContext setting default value for user.vehicle to a string instead of empty [] array? --causing PropTypes warnings  
- [x] Image gallery  
- [x] Registration -> 1st time Login -> Settings fails, find out why and fix  
- [x] Search on homepage  
- [x] Search flow design  
- [x] Logout flow on account page  
- [x] Delete image AJAX  
- [x] Adding/modifying a log entry  
- [x] Individual log item route - dynamic  
- [x] Individual log view (component modal or page?)  
- [x] Routing  
- [x] Caching - vehicle lookups  
- [x] Organization  
- [x] Simplify AppRouter via useContext  
- [x] Light Mode and switcher  
- [x] Color Scheme and abstraction  
- [x] Break up Settings page components, pull out api setting/getting to a separate module and import was needed  

