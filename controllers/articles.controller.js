const { promises } = require("supertest/lib/test.js");
const {
  selectArticleById,
  selectAllArticles,
  selectArticleComments,
  checkArticleID,
  insertComment,
} = require("../models/articles.models.js");

function getAllArticles(req, res, next) {
  selectAllArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
}

function getArticle(req, res, next) {
  const { article_id } = req.params;

  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
}

function getArticleComments(req, res, next) {
  const { article_id } = req.params;
  return Promise.all([
    checkArticleID(article_id),
    selectArticleComments(article_id),
  ])
    .then((result) => {
      if (result[0].length === 0) {
        res.status(404).send({ msg: "Article id is not found" });
      }
      const comments = result[1];
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
}

function postArticleComment(req, res, next) {
  const { article_id } = req.params;
  const { body } = req;

  return Promise.all([checkArticleID(article_id), insertComment(body)])
    .then((result) => {
      if (result[0].length === 0) {
        res.status(404).send({ msg: "Article id is not found" });
      }
      const comment = result[1];
      res.status(201).send({ comment });
    })
    .catch((err) => {
      console.log(err)
      next(err);
    });
}

module.exports = {
  getArticle,
  getAllArticles,
  getArticleComments,
  postArticleComment,
};
