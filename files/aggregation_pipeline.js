// or find({"personalInfo.firstName":"Edward"})
[
    {
      $match:{
        "personalInfo.firstName":"Edward"
      }
    }
  ]


//   To find the sum of amount of scholarship as per the year 

  [
    {
      $unwind: {
        path: "$financialAid.scholarships"
        // includeArrayIndex: 'string',
        // preserveNullAndEmptyArrays: boolean
      }
    },
    {
      $group: {
        _id: {
          year:"$financialAid.scholarships.year"
        },
        // $sum:"$financialAid.scholarships.amount"
        total_amount: {
          $sum: "$financialAid.scholarships.amount"
        }
      }
    },
    {
      $project: {
          "_id.total_amount":"$total_amount",
        "_id.year":"$_id.year"
      }
    },
    {
      $replaceRoot: {
        newRoot: "$_id"
      }
    }
    
  ]