import express from 'express';
import { Room } from '../../models';
import { TUserData } from '../../pages';

class RoomsController {
  async index(req: express.Request, res: express.Response) {
    try {
      const rooms = await Room.findAll();
      res.json(rooms);
    } catch (error) {
      res.status(500).json({
        message: 'Error',
        error,
      });
    }
  }

  async create(req: express.Request, res: express.Response) {
    try {
      const data = {
        title: req.body.title,
        type: req.body.type,
      };

      if (!data.title || !data.type) {
        return res.status(400).json({ message: 'Missing room title or room type' });
      }

      const room = await Room.create(data);
      res.status(201).json(room);
    } catch (error) {
      res.status(500).json({
        message: 'Error',
        error,
      });
    }
  }

  async show(req: express.Request, res: express.Response) {
    try {
      const id = +req.params.id;
      if (isNaN(id)) {
        return res.status(400).json({
          message: 'Wrong room id',
        });
      }
      const room = await Room.findByPk(id);

      if (!room) {
        return res.status(404).json({
          message: 'Room was not found',
        });
      }

      res.json(room);
    } catch (error) {
      res.status(500).json({
        message: 'Error',
        error,
      });
    }
  }

  async delete(req: express.Request, res: express.Response) {
    const id = req.params.id;
    try {
      await Room.destroy({ where: { id: id } });

      res.send();
    } catch (error) {
      res.status(500).json({
        message: 'Error',
        error,
      });
    }
  }
}

export const RoomsCtrl = new RoomsController();
