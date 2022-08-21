import express from 'express';
import { Ban, User } from '../../models';
import { TUserData } from '../../pages';

class AuthorizationController {
  getMe(req: express.Request, res: express.Response) {
    res.send(req.user);
  }

  async ban(req: express.Request, res: express.Response) {
    const userId = (req.user as TUserData).id;
    const bannedTime = req.query.banTime;
    try {
      const banned = await Ban.findOne({ where: { userId: userId } });
      if (banned) {
        await Ban.update({ unBannedTime: bannedTime }, { where: { userId: userId } });
        res.status(201).json({
          banned,
        });
      }

      if (!banned) {
        const ban = await Ban.create({
          userId,
          unBannedTime: bannedTime,
        });
        res.status(201).json(ban);
      }
    } catch (error) {
      res.status(400).json({
        message: error,
      });
    }
  }

  async getUserInfo(req: express.Request, res: express.Response) {
    const userId = req.params.id;

    try {
      const findUser = await User.findByPk(userId);
      console.log(findUser, userId);

      if (findUser) {
        res.json(await findUser);
      } else {
        res.status(400).json({
          message: 'User was not found',
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: 'Error on user search',
      });
    }
  }

  async checkBanned(req: express.Request, res: express.Response) {
    const userId = (req.user as TUserData).id;

    try {
      const banned = await Ban.findOne({
        where: { userId: userId },
        raw: true,
      });

      if (banned) {
        let banTime = Number(banned.unBannedTime) - Number(new Date().getTime());
        console.log(banTime);
        if (banTime <= 0) {
          await Ban.destroy({ where: { userId: userId } });
          console.log(111);
          return res.status(200).json({
            banned: false,
            timeLeft: 0,
          });
        }

        if (banTime >= 0) {
          return res.status(200).json({
            banned: true,
            timeLeft: new Date().getTime() - banned.banTime,
          });
        }
      }

      if (!banned) {
        return res.status(200).json({
          banned: false,
          timeLeft: 0,
        });
      }
    } catch (error) {
      res.status(400).json({
        message: 'Error on searching',
      });
    }
  }

  async activate(req: express.Request, res: express.Response) {
    const userId = (req.user as TUserData).id;
    const user = req.body.user;

    try {
      await User.update({ ...user, isActive: 1 }, { where: { id: userId } });
      console.log(user);
      res.send();
    } catch (error) {
      res.status(400).json({
        message: 'Error on creating profile',
      });
    }
  }
}

export const AuthCtrl = new AuthorizationController();
