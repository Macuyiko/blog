Title: Get A List Of Steam Games
Date: 2009-12-31
Author: Seppe "Macuyiko" vanden Broucke

**Update**: see [here](|filename|/2010/2010_05_get-list-of-steam-games-as-of-may-2010.md)for a new version which works on the new steam site.  

Using Python and [Beautiful Soup](http://www.crummy.com/software/BeautifulSoup/). Just a quick (ugly) script thrown together for future reference.  

    from BeautifulSoup import BeautifulSoup
    from urllib import urlopen  
    import re  
    import codecs  

    html_text = urlopen('http://store.steampowered.com/search/?advanced=0&term=&category1=998').read()  
    soup = BeautifulSoup(html_text)  
    f = codecs.open('./output.txt', 'w', 'iso-8859-1')  

    pages = 1  

    print "-- Retrieving number of pages..."  

    for link in soup.findAll('a', attrs={'href' : re.compile("http://store.steampowered.com/search/\?sort_by=&sort_order=ASC&category1=998&page=\d+")}):  
     try:  
      page = int(link.string)  
      if page > pages:  
       pages = page  
      except ValueError:  
       pass  
    
    print "-- Pages found:",pages  

    for page in range(1,pages+1):  
     print "-- Retrieving page:",page  
     html_text = urlopen('http://store.steampowered.com/search/?sort_by=&sort_order=ASC&category1=998&page='+str(page)).read().decode('iso-8859-1')  
     soup = BeautifulSoup(html_text)  
     for item in soup.findAll('div', attrs={'class' : "global_area_tabs_item_txt"}):  
      f.write(item.h3.string+'\r\n')   

    f.close()  
