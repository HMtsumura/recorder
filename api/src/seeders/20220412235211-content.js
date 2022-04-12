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
      title: 'title test3',
      comment: 'test3',
      color_code: '#00ff7f',
      record_ymd: '20220408',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      user_id: 1,
      category_id: 2,
      title: 'title test4',
      comment: 'test4',
      color_code: '#00ffff',
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
