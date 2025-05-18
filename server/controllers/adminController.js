
const jwt = require('jsonwebtoken')
const User = require('../Model/User');
const Deposit = require('../Model/depositSchema');
const Widthdraw = require('../Model/widthdrawSchema');
const Trade = require("../Model/livetradingSchema");
const Loan = require("../Model/loanSchema");
const Verify = require("../Model/verifySchema");
const Signal = require('../Model/signalSchema');
const Copy = require('../Model/copySchema');
const Upgrade = require('../Model/upgrade');
const Ticket  = require('../Model/ticketSchema');
const nodemailer = require('nodemailer');


const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '', };

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'that email is already registered';
    return errors;
  }
  // validation errors
  if (err.message.includes('user validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }


  return errors;
}


const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'piuscandothis', {
    expiresIn: maxAge
  });
};


module.exports.loginAdmin_post = async(req, res) =>{
  try {
    const { email, password } = req.body;

    const user = await User.findOne({email: email});

    if(user){
    const passwordMatch = await (password, user.password);

    if (passwordMatch) {
      
      if(!user.role == "admin"){
        res.render('login', handleErrors('Email and password is incorrect') )
      }else{
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id });
      }
      
    } else {
      res.render('login', handleErrors() )
    }
    } else{
      res.render('login',handleErrors() )
    }
    
  } catch (error) {
    console.log(error)
  }
    
}

module.exports.adminNavbarPage = (req, res)=>{
  res.render("adminnavbarPage")
}


// *******************ADMIN DASHBOARD CONTROLLERS *************************//


module.exports.adminPage = async(req, res) =>{
        let perPage = 100;
        let page = req.query.page || 1;
    
        try {
          const user = await User.aggregate([ { $sort: { createdAt: -1 } } ])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec(); 
          // const count = await User.count();
    
          res.render('adminDashboard',{user});
    
        } catch (error) {
          console.log(error);
        } 
    } 


module.exports.viewUser = async(req, res) =>{
    try {
        const user = await User.findOne({ _id: req.params.id })
        res.render("viewUser",{
          user
        })
    
      } catch (error) {
        console.log(error);
      }
    
    }
  


    module.exports.editUser = async(req, res) =>{
      try {
        const infoErrorsObj = req.flash('infoErrors');
        const infoSubmitObj = req.flash('infoSubmit');
          const user = await User.findOne({ _id: req.params.id })
      
          res.render('editUser', {
            user,
            infoErrorsObj,
            infoSubmitObj
          })
      
        } catch (error) {
          console.log(error);
        }
  }
const sendEmail = async ( fullname,email, available,  balance, bonus, widthdrawBalance,profit,totalDeposit,totalWidthdraw,verifiedStatus,account, session ) =>{
    
  try {
    const transporter =  nodemailer.createTransport({
      host: 'mail.globalflextyipsts.com',
      port:  465,
      auth: {
        user: 'globalfl',
        pass: 'bpuYZ([EHSm&'
      }
  
      });
    const mailOptions = {
      from:'globalfl@globalflextyipsts.com',
      to:email,
      subject: 'Dashboard Update',
      html: `<p>Greetings ${fullname},<br>Here are your availabe balances and your trading account status.<br>
      login to see your dashboard:<br>Email:${email}<br>Available balance: ${available}<br>Deposit Balance: ${balance}<br>Bonus:${bonus}<br>Widthdrawal Balance: ${widthdrawBalance}<br>Account Profit:${profit}<br>Total Deposit:${totalDeposit}<br>Total Widthdraw: ${totalWidthdraw}<br> Verification status: ${verifiedStatus}<br>Account Level: ${account}<br>trading sessions: ${session}<br><br>You can login here: https://globalflextyipests.com/loginAdmin<br>.<br>Thank you.</p>`
  }
  transporter.sendMail(mailOptions, (error, info) =>{
    if(error){
        console.log(error);
        res.send('error');
    }else{
        console.log('email sent: ' + info.response);
        res.send('success')
    }
})
}catch (error) {
  console.log(error.message);
}

}



module.exports.editUser_post = async(req, res) =>{
  try {
    await User.findByIdAndUpdate(req.params.id,{
     fullname: req.body.fullname,
      email: req.body.email,
      country: req.body.country,
      tel:req.body.tel,
      profit: req.body.profit,
      balance: req.body.balance,
      totalwithdraw: req.body.totalwithdraw,
      annText:req.body.annText,
      annLink:req.body.annLink,
      annButton:req.body.annButton,
      updatedAt: Date.now()
    });
      //  if(User){
      // sendEmail(req.body.fullname,req.body.email, req.body.available, req.body.balance, req.body.bonus,req.body.widthdrawBalance, req.body.profit, req.body.totalDeposit,req.body.totalWidthdraw,req.body.signal, req.body.verifiedStatus,req.body.account, req.body.session )
      // }else{
      //   console.log(error);
      // }
      req.flash('infoSubmit', 'client updated successfully.')
      await res.redirect(`/editUser/${req.params.id}`); 
      console.log('redirected');

  } catch (error) {
    console.log(error);
  }
    
}

module.exports.generateOTP = async (req, res) => {
  try {
      const user = await User.findById(req.params.id);
      if (!user) {
          return res.status(404).json({ error: "User not found" });
      }

      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000);
      
      // Set OTP and expiration (24 hours)
      user.otp = otp;
      user.otpExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // Changed to 24 hours
      await user.save();

      res.json({ otp: otp, message: "OTP generated successfully" });
  } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Error generating OTP" });
  }
};



module.exports.deletePage = async(req, res) =>{
  try {
    await User.deleteOne({ _id: req.params.id });
      res.redirect("/adminRoustes")
    } catch (error) {
      console.log(error);
    }
}

// *******************ALL DEPOSITS CONTROLLERS *************************//

module.exports.allDeposit = async(req, res) =>{
    let perPage = 100;
    let page = req.query.page || 1;

    try {
      const deposit = await Deposit.aggregate([ { $sort: { createdAt: -1 } } ])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec(); 
     

      res.render('allFunding',{
        deposit
      });

    } catch (error) {
      console.log(error);
    } 
}

module.exports.viewDeposit = async(req, res) =>{
    try {
        const deposit = await Deposit.findOne({ _id: req.params.id })
    
        res.render('viewDeposits',{
          deposit
        })
    
      } catch (error) {
        console.log(error);
      }

}

module.exports.editDeposit = async(req, res) =>{
    try {
      const infoErrorsObj = req.flash('infoErrors');
      const infoSubmitObj = req.flash('infoSubmit');
        const deposit = await Deposit.findOne({ _id: req.params.id })
    
        res.render('editDeposit',{
          deposit,
          infoErrorsObj,
          infoSubmitObj
        })
    
      } catch (error) {
        console.log(error);
      }
  
}

module.exports.editDeposit_post  = async(req, res) =>{
    try {
        await Deposit.findByIdAndUpdate(req.params.id,{
          coinSelect: req.body.coinSelect,
          amount: req.body.amount,
          status: req.body.status,
          updatedAt: Date.now()
        });
        req.flash('infoSubmit', 'deposit updated successfully.')
        await res.redirect(`/editDeposit/${req.params.id}`);
        
        console.log('redirected');
      } catch (error) {
        console.log(error);
      }
    
}

module.exports.deleteDeposit = async(req, res) =>{
    try {
        await Deposit.deleteOne({ _id: req.params.id });
        res.redirect("/adminRoustes")
      
    } catch (error) {
        console.log(error)
    }
    
}

// // *******************ALL WIDTHDRAWALS  CONTROLLERS *************************//

module.exports.allWidthdrawal = async(req, res) =>{
    let perPage = 100;
    let page = req.query.page || 1;

    try {
      const widthdraw = await Widthdraw.aggregate([ { $sort: { createdAt: -1 } } ])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec(); 
      // const count = await Widthdraw.count();

      res.render('allWidthdrawals',{
        widthdraw
      });

    } catch (error) {
      console.log(error);
    } 
}


module.exports.viewWidthdrawal = async(req, res) =>{
    try {
        const widthdraw = await Widthdraw.findOne({ _id: req.params.id })
    
        res.render('viewWidthdrawals',{widthdraw})
    
      } catch (error) {
        console.log(error);
      }
}


module.exports.editWidthdrawal = async(req, res) =>{
    try {
        const infoErrorsObj = req.flash('infoErrors');
        const infoSubmitObj = req.flash('infoSubmit');
        const widthdraw = await Widthdraw.findOne({ _id: req.params.id })
    
        res.render('editWidthdrawals',{
          widthdraw,
          infoErrorsObj,
          infoSubmitObj
        })
    
      } catch (error) {
        console.log(error);
      }
}

module.exports.editWidthdrawal_post = async(req, res) =>{
    try {
        await Widthdraw.findByIdAndUpdate(req.params.id,{
          amount: req.body.amount,
          type: req.body.type,
          status: req.body.status,
          narration: req.body.narration,
          updatedAt: Date.now()
        });
        req.flash('infoSubmit', 'widthdrawal updated successfully.')
        await res.redirect(`/editWidthdrawals/${req.params.id}`);
        
        console.log('redirected');
      } catch (error) {
        console.log(error);
      }
    
}

module.exports.deleteWidthdraw = async(req, res) =>{
    try {
        await Widthdraw.deleteOne({ _id: req.params.id });
        res.redirect("/adminRoustes")
      
    } catch (error) {
        console.log(error)
    }
}


// // *******************ALL VERIFICATION CONTROLLERS *************************//

module.exports.allVerification = async(req, res)=>{
    let perPage = 100;
    let page = req.query.page || 1;

    try {
      const verify = await Verify.aggregate([ { $sort: { createdAt: -1 } } ])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec(); 
      res.render('allVerification',{
        verify
      });

    } catch (error) {
      console.log(error);
    } 
}

module.exports.viewVerify = async(req, res)=>{
   try {
        const verify = await Verify.findOne({ _id: req.params.id })
    
    res.render("viewVerification",{verify})
    
    } catch (error) {
      console.log(error);
    }

}


module.exports.deleteVerification = async(req, res)=>{
  try {
    await Verify.deleteOne({ _id: req.params.id });
    res.redirect("/adminRoute")
  
} catch (error) {
    console.log(error)
}
}

// // *******************LIVETRADES CONTROLLERS *************************//

module.exports.alllivetradePage = async(req, res)=>{
  let perPage = 100;
  let page = req.query.page || 1;

  try {
    const livetrade = await Trade.aggregate([ { $sort: { createdAt: -1 } } ])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec(); 
    // const count = await Widthdraw.count();

    res.render('allLivetrades',{
      livetrade
    });

  } catch (error) {
    console.log(error);
  } 
}

module.exports.viewlivetradePage= async(req, res)=>{
  try {
    const livetrade = await Trade.findOne({ _id: req.params.id })

res.render('viewallliveTrades',{
  livetrade
})
      } catch (error) {
        console.log(error);
      }
}


module.exports.editlivetradePage= async(req, res)=>{
  try {
    const infoErrorsObj = req.flash('infoErrors');
   const infoSubmitObj = req.flash('infoSubmit');
    const livetrade = await Trade.findOne({ _id: req.params.id })

res.render('editallliveTrades',{
  livetrade,
  infoErrorsObj,
  infoSubmitObj
})
      } catch (error) {
        console.log(error);
      }
}

module.exports.editLivetrade_post = async(req, res)=>{
  try {
    await Trade.findByIdAndUpdate(req.params.id,{
      asset: req.body.asset,
      amount: req.body.amount,
      leverage: req.body.leverage,
      expire: req.body.expire,
      order: req.body. order,
      status: req.body.status,
      updatedAt: Date.now()
    }); 
    req.flash('infoSubmit', 'livetrade updated successfully.')
    await res.redirect(`/edit-livetrade/${req.params.id}`);
    console.log('redirected');
  } catch (error) {
    console.log(error);
  }
}

module.exports.deleteLivetrade = async(req, res)=>{
  try {
    await Trade.deleteOne({ _id: req.params.id });
    res.redirect("/adminRoute")
  
} catch (error) {
    console.log(error)
}
}



// // *******************ACCOUNT UPGRADES CONTROLLERS *************************//

module.exports.allupgradesPage = async(req, res)=>{
  let perPage = 100;
  let page = req.query.page || 1;

  try {
    const upgrade = await Upgrade.aggregate([ { $sort: { createdAt: -1 } } ])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec(); 
    // const count = await Widthdraw.count();

    res.render('allAccountsUpgrade',{
      upgrade
    });

  } catch (error) {
    console.log(error);
  } 
}


module.exports.viewUprgadesPage = async(req, res)=>{

  try {
    const upgrade = await Upgrade.findOne({ _id: req.params.id })

res.render('viewallAccountsUpgrade',{
  upgrade
})

      } catch (error) {
        console.log(error);
      }
}

module.exports.editUpgradesPage = async(req, res)=>{
  try {
    const infoErrorsObj = req.flash('infoErrors');
   const infoSubmitObj = req.flash('infoSubmit');
    const upgrade = await Upgrade.findOne({ _id: req.params.id })

  res.render('editallAccountsUpgrade',{
  upgrade,
  infoErrorsObj,
  infoSubmitObj
  })
      } catch (error) {
        console.log(error);
      }
}

module.exports.editUpgrade_post  = async(req, res)=>{
  try {
    await Upgrade.findByIdAndUpdate(req.params.id,{
      type:req.body.type,
      amount:req.body.amount,
      amount:req.body.amount,
      duration:req.body.duration,
      status:req.body.status,
      updatedAt: Date.now()
    });
    req.flash('infoSubmit', 'upgrade updated successfully.')
    await res.redirect(`/editUpgrade/${req.params.id}`);
    
    console.log('redirected');
  } catch (error) {
    console.log(error);
  }
}

module.exports.deleteUpgrade = async(req, res)=>{
  try {
    await Upgrade.deleteOne({ _id: req.params.id });
    res.redirect("/adminRoute")
  
} catch (error) {
    console.log(error)
}
}


// // *******************LOANS CONTROLLERS *************************//

module.exports.allLoan = async(req, res)=>{
  let perPage = 100;
  let page = req.query.page || 1;

  try {
    const loan = await Loan.aggregate([ { $sort: { createdAt: -1 } } ])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec(); 
    // const count = await Widthdraw.count();

    res.render('allLoan',{
      loan
    });

  } catch (error) {
    console.log(error);
  } 
}


module.exports.viewLoan = async(req, res)=>{

  try {
    const loan = await Loan.findOne({ _id: req.params.id })

res.render('viewallLoan',{
  loan
})

      } catch (error) {
        console.log(error);
      }
}

module.exports.editLoanPage = async(req, res)=>{
  try {
    const infoErrorsObj = req.flash('infoErrors');
   const infoSubmitObj = req.flash('infoSubmit');
    const loan = await Loan.findOne({ _id: req.params.id })

  res.render('editLoan',{
    loan,
  infoErrorsObj,
  infoSubmitObj
  })
      } catch (error) {
        console.log(error);
      }
}

module.exports.editLoanPage_Post  = async(req, res)=>{
  try {
    await Loan.findByIdAndUpdate(req.params.id,{
      amount:req.body.amount,
      loanType:req.body.loanType,
      duration:req.body.duration,
      income:req.body.income,
      desc:req.body.desc,
      status:req.body.status,
      updatedAt: Date.now()
    });
    req.flash('infoSubmit', 'loan u pdated successfully.')
    await res.redirect(`/editLoan/${req.params.id}`);
    
    console.log('redirected');
  } catch (error) {
    console.log(error);
  }
}

module.exports.deleteLoan = async(req, res)=>{
  try {
    await Loan.deleteOne({ _id: req.params.id });
    res.redirect("/adminRoustes")
  
} catch (error) {
    console.log(error)
}
}


// ********************************Copytrading*******************************************//

module.exports.allCopytrades = async(req, res)=>{
  let perPage = 100;
  let page = req.query.page || 1;

  try {
    const copy = await Copy.aggregate([ { $sort: { createdAt: -1 } } ])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec(); 
    // const count = await Widthdraw.count();

    res.render('allCopytrades',{copy });

  } catch (error) {
    console.log(error);
  } 
}

module.exports.viewCopytrades = async(req, res)=>{
  try {
    const copy = await Copy.findOne({ _id: req.params.id })

res.render('viewCopytrades',{copy})
      } catch (error) {
        console.log(error);
      }
}

module.exports.deleteCopy = async(req, res)=>{
  try {
    await Copy.deleteOne({ _id: req.params.id });
    res.redirect("/adminRoustes")
  
} catch (error) {
    console.log(error)
}
}


// ********************************SIGNALS*************************//

module.exports.allSignal = async(req, res)=>{
  let perPage = 100;
  let page = req.query.page || 1;

  try {
    const signal = await Signal.aggregate([ { $sort: { createdAt: -1 } } ])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec(); 
    res.render('allSignal',{signal});

  } catch (error) {
    console.log(error);
  } 
}

module.exports.viewSignal = async(req, res)=>{
 try {
      const signal = await Signal.findOne({ _id: req.params.id })
  
  res.render("viewSignal",{signal})
  
  } catch (error) {
    console.log(error);
  }

}

module.exports.deleteSignal = async(req, res)=>{
try {
  await Signal.deleteOne({ _id: req.params.id });
  res.redirect("/adminRoustes")

} catch (error) {
  console.log(error)
}
}


// *********************************TICKETS*********************************//
module.exports.allTTicketPage = async(req, res)=>{
  let perPage = 100;
  let page = req.query.page || 1;

  try {
    const tickets = await Ticket.aggregate([ { $sort: { createdAt: -1 } } ])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec(); 
    // const count = await Widthdraw.count();

    res.render('allTickets',{ tickets});

  } catch (error) {
    console.log(error);
  }   
}


module.exports.viewTicketPage = async(req, res)=>{

  try {
    const tickets = await Ticket.findOne({ _id: req.params.id })

res.render('viewTickets',{tickets})

      } catch (error) {
        console.log(error);
      }
}

module.exports.deleteTicket = async(req, res)=>{
  try {
    await Ticket.deleteOne({ _id: req.params.id });
    res.redirect("/adminRoustes")
  
} catch (error) {
    console.log(error)
}
}

