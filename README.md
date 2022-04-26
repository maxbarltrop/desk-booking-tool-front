# desk-booking-tool-front
 The desk booking tool is a React App that I made along with one
 other coworker over a co-op term in early 2020. 
 
 It won't build after removing the company tags and backend functionality, but it utilizes a calendar
 module, allows for file uploading, and applies jQuery to do some powerful DOM manipulation. 
 
 The goal was to create
 a tool for employees at the company to book desks to be able to return
 to the office within a certain set of restrictions that aimed to
 maintain social distancing.
 Admins can upload a floorplan and drag-and-drop desks elements over
 the image to signify where desks are placed, marking them as bookable
 or unbookable. The floors can then be linked to a given
 building/office. Admins can also set restrictions as to how many days
 in a row and how far in advance users can book. Users can then log in
 with their company email, select a floor and date, and book a desk
 within the given parameters. The webapp then sends a confirmation to
 the user's company email account. This project was completed to the level 
 of a functional demo on a two-week deadline. One of the major challenges was implementing
 drag-and-drop then being able to save the position of the desk, write
 it to the database, then retrieve it and render it properly on
 different screen sizes. The drag-and-drop functionality was part of
 the project requirements, but React does not provide a useful
 draggable wrapper. Since the floorplans were user provided, desks
 needed to be placed anywhere, so I gained a strong foundation in
 jQuery in trying to save and render the positioning.
