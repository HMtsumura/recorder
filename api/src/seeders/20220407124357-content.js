'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
     return queryInterface.bulkInsert('Contents', [{
      user_id: 1,
      category_id: 1,
      title_id: 2,
      comment: 'test2',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      user_id: 1,
      category_id: 1,
      title_id: 3,
      comment: 'test3',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     return queryInterface.bulkDelete('Contents', null, {});
  }
};
