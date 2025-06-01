pub mod constants;
pub mod instructions;

use anchor_lang::prelude::*;

pub use constants::*;
use instructions::*;

declare_id!("3b9MSTDA79bPXqEP8TXiFXkaN3ZtKii1iAsmrjfvhycJ");

#[program]
pub mod multi_buy {
    use super::*;

    pub fn multi_buy(
        ctx: Context<MultiBuy>,
        amount_in: u64,
        minimum_amount_out: u64,
        token_length: u8,
    ) -> Result<()> {
        instructions::multi_buy(ctx, amount_in, minimum_amount_out, token_length)
    }
}
