const sinon = require('sinon');

const { productsMock, filteredProductsMock } = require('./products');

const getAllStub = sinon.stub();
getAllStub.withArgs('products').resolves(productsMock);

const tagQuery = { tags: { $in: ['Living Room'] } };
getAllStub
    .withArgs('products', tagQuery)
    .resolves(filteredProductsMock('Living Room'));

const createStub = sinon.stub().resolves(productsMock[0].id);

class MongoConnectMock {
    getAll(collection, query) { // eslint-disable-line class-methods-use-this
        return getAllStub(collection, query);
    }

    create(collection, data) {// eslint-disable-line class-methods-use-this
        return createStub(collection, data);
    }
}

module.exports = {
    getAllStub,
    createStub,
    MongoConnectMock
};
