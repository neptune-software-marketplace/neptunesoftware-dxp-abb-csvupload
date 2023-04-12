// Description:
//     Upload your CSV file to convert it into a table or upload data to a pre-existing table which is compatable with the file you are using.
    
//     After complition, you can create also REST APIs with the corresponding table as a Table Definition.

//     There is a limit of rows to enter and the formula to calculate maximun number of rows is: max_number_rows = 2100/(5+number_of_columns). The plus 5 is because in the Table Definition, 5 extra columns are generated (id,createdBy , etc)

//     The Building Block gathers all the available tables in your instance if you wish to upload data to an existing table. 

//     Be cautious if you are uploading data to an existing table since there is an option to drop old data from the table you want to work with.

//     A table is created once you reach the second stage of complition thus, please do check for any empty tables or mistakes in your Table Definition Tile.

// HOW TO USE:
//     1. If the table does not exist, then upload the CSV file either with the header or not (you can define the name of the columns later on if you do not have a header in your file)
//     1. If the table exists, then upload the CSV file and if there exists a header, remember to exclude this as a new row of data.
//     2. Drop any entries that you wish.
//     3. Create, if you wish, APIs which are connected to the existing/new table. 

