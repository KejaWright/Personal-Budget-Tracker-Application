# Personal-Budget-Tracker-Application
Students will develop a personal budget tracker application that allows users to: 1) Add, update, and delete financial transactions (income and expenses). 2) Categorize transactions (e.g., Income, Food, Bills, Entertainment). 3) View their current financial balance. 4) Filter and sort transactions by category, type, or date.

*How to open (local file):*
There is a shortcut, click on the shortcut created. It should open up index.html.
If the shortcut doesn't work, then go into the folder code>html and click the file titled "index".

*How to open (online/github link):*
Just click the link to open the application.


*How it works:*
Basically, any information that is input into any table (income, expenses, complete transactions, income/expense overview) will be stored with localStorage instead of an online database, that way the user can use the application (on the computer) offline.
If you want to clear all information, either clear your cache, (in your browser) open inspect> go to console> type localStorage.clear();, or go to settings and clear the respective fields based on whatever option you click.

*How to use:*
To export transaction information, go to the transactions page and click the print button.
To export general income/expense information, go to insights page and click the print button.
To change system theme, go to settings, and it is self-explanatory from there.
To delete specific all income/expense/transaction information, go to settings, and it is self-explanatory from there.

*Devices Supported:*
>Offline
For right now (4/6/2025), offline mode is currently only stable for computers, as this device type allows the user to open local files like html directly. Other devices like phones or tablets might be able to open the html file, but it will not load the javascript or css associated with in unless it is within the file itself.
>Online
All devices support the web version of this app. The web version does not use a database/server, so all information is stored with localStorage.

*Updates/fixes:*
1) (2025/4/6)-Rough application is created and uploaded to github. Semi-Working forms are "Home" and "Transactions".