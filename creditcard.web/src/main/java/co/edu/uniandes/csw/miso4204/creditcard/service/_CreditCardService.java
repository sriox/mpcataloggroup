/* ========================================================================
 * Copyright 2014 miso4204
 *
 * Licensed under the MIT, The MIT License (MIT)
 * Copyright (c) 2014 miso4204

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 * ========================================================================


Source generated by CrudMaker version 1.0.0.qualifier

*/

package co.edu.uniandes.csw.miso4204.creditcard.service;

import java.util.List;

import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.QueryParam;
import javax.inject.Inject;

import co.edu.uniandes.csw.miso4204.creditcard.logic.api.ICreditCardLogicService;
import co.edu.uniandes.csw.miso4204.creditcard.logic.dto.CreditCardDTO;
import co.edu.uniandes.csw.miso4204.creditcard.logic.dto.CreditCardPageDTO;


public abstract class _CreditCardService {

	@Inject
	protected ICreditCardLogicService creditCardLogicService;
	
	@POST
	public CreditCardDTO createCreditCard(CreditCardDTO creditCard){
		return creditCardLogicService.createCreditCard(creditCard);
	}
	
	@DELETE
	@Path("{id}")
	public void deleteCreditCard(@PathParam("id") Long id){
		creditCardLogicService.deleteCreditCard(id);
	}
	
	@GET
	public CreditCardPageDTO getCreditCards(@QueryParam("page") Integer page, @QueryParam("maxRecords") Integer maxRecords){
		return creditCardLogicService.getCreditCards(page, maxRecords);
	}
	
	@GET
	@Path("{id}")
	public CreditCardDTO getCreditCard(@PathParam("id") Long id){
		return creditCardLogicService.getCreditCard(id);
	}
	
	@PUT
	public void updateCreditCard(@PathParam("id") Long id, CreditCardDTO creditCard){
		creditCardLogicService.updateCreditCard(creditCard);
	}
	
}