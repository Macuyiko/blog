Title: Get A List Of Steam Games (As Of May 2010)
Date: 2010-05-16
Author: Seppe "Macuyiko" vanden Broucke

Using Python and Beautiful Soup. This updates the previous script posted on this blog.

    from BeautifulSoup import BeautifulSoup
    from urllib import urlopen
    import re

    CATEGORY_GAMES     = '998'
    CATEGORY_VIDEOS    = '999'
    CATEGORY_DEMOS     = '10'
    CATEGORY_MODS      = '997'
    CATEGORY_PACKS     = '996'
    CATEGORY_DLC       = '21'

    html_text = urlopen('http://store.steampowered.com/search/?sort_by=&sort_order=ASC&category1='+CATEGORY_GAMES).read().decode('utf-8')

    soup = BeautifulSoup(html_text)

    f = open('./output.txt', 'w')

    pages = 1
    games = 0

    print "-- Retrieving number of pages..."

    for link in soup.findAll('a', attrs={'href' : re.compile(r"http://store.steampowered.com/search/.*&page=\d+")}):
     try:
      page = int(link.string)
      if page > pages:
       pages = page
     except ValueError:
      pass

    print "-- Pages found:",pages

    for page in range(1,pages+1):
     print "-- Retrieving page:",page
     html_text = urlopen('http://store.steampowered.com/search/?sort_by=&sort_order=ASC&category1='+CATEGORY_GAMES+'&page='+str(page)).read().decode('utf-8')
     soup = BeautifulSoup(html_text)
     for item in soup.findAll('a', attrs={'class' : re.compile(r'\bsearch_result_row\b')}):
      games += 1
      #get information
      appname      = item.find('div', attrs={'class' : re.compile(r'\bsearch_name\b')}).h4.string
      appprice     = item.find('div', attrs={'class' : re.compile(r'\bsearch_price\b')}).string
      appscore     = item.find('div', attrs={'class' : re.compile(r'\bsearch_metascore\b')}).string
      apprelease   = item.find('div', attrs={'class' : re.compile(r'\bsearch_released\b')}).string
      appurl       = item['href']
      appid        = re.match(r"http://store.steampowered.com/(\w+)/(\d+)/", appurl)
      appimage     = re.sub(r"\?t=\d+","",item.find('div', attrs={'class' : re.compile(r'\bsearch_capsule\b')}).img['src'])

      #write information to file
      f.write(str(appname)+'\r\n')
      f.write(str(appprice)+'\r\n')
      f.write(str(appurl)+'\r\n')
      f.write(str(appimage)+'\r\n')
      f.write(str(apprelease)+'\r\n')
      f.write(str(appscore)+'\r\n')
      f.write(str(appid.group(1))+"/"+str(appid.group(2))+'\r\n')
      f.write('\r\n')

    print "-- Games found:",games
    f.close()
