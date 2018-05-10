from csv import reader
from pyspark.mllib.recommendation import *
from pyspark.sql.functions import format_string

tuple_path = "s3://million-song-dataset-yizhou/TasteProfile/train_triplets.txt"

df = spark.read.load(tuple_path, format="csv", sep="\t", inferSchema="true", header=None)


# Transform index
from pyspark.ml.feature import StringIndexer
user_indexer = StringIndexer(inputCol="_c0", outputCol="user_index")
song_indexer = StringIndexer(inputCol="_c1", outputCol="song_index")

partial_indexed = user_indexer.fit(df).transform(df)
indexed = song_indexer.fit(partial_indexed).transform(partial_indexed)

indexed.createOrReplaceTempView("indexed")

res_df = spark.sql("select user_index, song_index, _c2 as click from indexed")
res_df = res_df.select(format_string("%.0f,%.0f,%d",res_df.user_index,res_df.song_index,res_df.click))
rdd = res_df.rdd.flatMap(list).map(lambda x:x.split(","))
model = ALS.trainImplicit(rdd, 25, seed=10)


# Generate userIndex
temp1 = spark.sql("select distinct _c0,user_index from indexed")
user_df = temp1.select(format_string("%s,%.0f",temp1._c0,temp1.user_index))
user_df.write.save("s3://million-song-dataset-yizhou/TasteProfile/userIndex",format="text")

# Generate songIndex
temp2 = spark.sql("select distinct _c1,song_index from indexed")
song_df = temp2.select(format_string("%s,%.0f",temp2._c1,temp2.song_index))
song_df.write.save("s3://million-song-dataset-yizhou/TasteProfile/songIndex",format="text")


# Get recommends
recommends = model.recommendProductsForUsers(20)



# Transform
def extractMapper(x):
    user, ratings = x
    products = list(map(lambda y:y.product, ratings))
    return user, products

def formatMapper(x):
    user, products = x
    products = list(map(str,products))
    return str(user) + "\t" + ",".join(products)

recommends.map(ExtractMapper).map(formatMapper).saveAsTextFile("s3://million-song-dataset-yizhou/TasteProfile/recommendList")
    