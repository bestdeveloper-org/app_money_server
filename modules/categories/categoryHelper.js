const mongoQuery = require('../../utils/mongoQuery')();
const ObjectID = require("mongodb").ObjectID

class CategoryHelper {

    async add_edit(data, tokenObj) {

    var findCriteria = {};
    findCriteria.id = data.id;

    var setCriteria = {
        '$set': {
            name:data.name,
            id:data.id,
            userId: tokenObj.id
        }
    }

    var entity= await mongoQuery.categorySchema.Category.update(findCriteria, setCriteria, {
        upsert: true
    });
    return entity;

}

    async get(data, tokenObj) {


    console.log(data);
    console.log(tokenObj);
    var findCriteria = {
        userId: new ObjectID(tokenObj.id)
    };

    var entity= await mongoQuery.categorySchema.Category.find(findCriteria);

    console.log(entity);
    return entity;

}

    async getByID(data) {
    console.log(data);
    var findCriteria = {
        _id: new ObjectID(data._id)
    };

    var entity= await mongoQuery.categorySchema.Category.findOne(findCriteria);

    console.log(entity);
    return entity;

}

    async updateCategoryName(data) {
        var dbResult = await mongoQuery.categorySchema.Category.updateOne({
            _id : new ObjectID(data._id)
        },{
            $set:{
                name : data.name,
            }
        });
        return dbResult;
    }

    async getCategoryPages(obj) {

        const filterCriteria = {};
        const fields = {};
        var filter =  mongoQuery.categorySchema.Category.find(filterCriteria);

        if (obj.pager) {
            obj.pager.itemsOnPage = parseInt(obj.pager.itemsOnPage);
            obj.pager.pageNo--;
            filter = filter.limit(obj.pager.itemsOnPage)
                .skip(obj.pager.itemsOnPage * obj.pager.pageNo)
            // query = query.sort({
            //   dateAdded: -1
            // });
        }

        const list = await mongoQuery.executeQuery(filter);
        const count = await mongoQuery.collection('categories').count(filterCriteria);

        return {
            items: list,
            count: count,
            pageNo: obj.pager ? obj.pager.pageNo + 1 : 0
        };
    }
}

module.exports = new CategoryHelper();