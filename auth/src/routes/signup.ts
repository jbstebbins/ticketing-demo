import express, { Request, Response } from 'express';
import { body } from "express-validator";
import jwt from 'jsonwebtoken';

import { User } from "../models/user";
import { validateRequest, BadRequestError } from "common";


const router = express.Router();

router.post('/api/users/signup', [
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .isLength({ min: 4 })
        .withMessage('Password must be greater than 4 characters')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        
        const { email, password } = req.body;

        const exisitngUser = await User.findOne({ email });

        if (exisitngUser) {
            throw new BadRequestError('Email in use');
        }

        const user = User.build({ email, password });
        await user.save();

        //generate jwt
        const userJwt = jwt.sign({
            id: user.id,
            email: user.email
        }, 
        process.env.JWT_KEY!
        );

        //store on session object
        req.session = {
            jwt: userJwt
        }

        res.status(201).send(user);

        }
);


export { router as signupRouter };