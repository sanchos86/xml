Создайте страничку, которая будет брать URL из параметра XML,
загружать с него XML и выдавать на странице следующую информацию о нем:

1.Число внутренних ссылок (теги `<a href="#id">`)  
2.Суммарное число букв внутри тегов, не включая пробельные символы (`<aaa dd="ddd">text</aaa>` - четыре буквы)  
3.Суммарное число букв нормализованного текста внутри тегов, включая и пробелы  
4.Число битых внутренних ссылок (ссылки на несуществующие ID элементов)  