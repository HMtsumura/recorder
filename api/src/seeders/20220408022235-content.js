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
      title: 'title test1',
      comment: 'test1',
      color_code: '#ffa500',
      record_ymd: '20220408',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      user_id: 1,
      category_id: 1,
      title: 'title test2',
      comment: 'test2',
      color_code: '#008080',
      record_ymd: '20220408',
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
  }
};
