const Joi = require('joi');
async function main(req, res){
    const schema2 = Joi.object({
        city: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required(),
        country: Joi.string()
            .min(3)
            .max(30)
            .optional(),
            test:Joi.string()
            .min(3)
            .max(30)
            .optional(),
            
    })
    const schema = Joi.object({
        name: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required(),
    
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
            
        mobile: Joi.string()
        .min(10)
        .max(11),
        mobile2: Joi.number()
        .min(1000000000),
        address: Joi.string()
        .min(10)
        .max(11),
        mobile2: Joi.number()
        .min(1000000000),
        address:schema2,
        // array:Joi.array().length(5),
        array:Joi.array().items(Joi.string().valid('a', 'b')),
        testBool:Joi.bool(),

        // .max(11)
    })
    
    // .with('username')
    // .xor('username')
    // .with('username');
    // schema.validate(req.body);
    try {
        const value = await schema.validateAsync(JSON.parse(JSON.stringify(req.body)));
        console.log(value)
        res.send(value)
    }
    catch (err) { 
        console.log(err)
        res.send(err)
    }
        // .with('username', 'birth_year')
        // .xor('password', 'access_token')
        // .with('password', 'repeat_password');
}

module.exports={
    main : main
}