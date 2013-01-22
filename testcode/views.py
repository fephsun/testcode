# Shawn Jain
# 1/19/2013
# Testcode project
# views.py

# This file defines the logic to display the page. Methods are 
# invoked automatically when a url is matched in urls.py

# imports
from django.http import HttpResponse, HttpResponseRedirect
from django.template import Template, Context
from django.template.loader import get_template
from django.shortcuts import render
from django.template import RequestContext
# import for json 
from django.utils import simplejson

# Import models 
from testcode.models import *

# This is the homepage with login 
def home(request):
	t = get_template("simplelogin.html")
	html = t.render(RequestContext(request, {}))
	return HttpResponse(html)

# This is the student navigation page
def student(request):
	# Load user_id with session, match to user, set context based on user
	user_id = request.session["user_id"]
	# Match to user in DB
	try:
		currentUser = User.objects.get(user_id=user_id)
	# If no match, redirect to homepage.
	except User.DoesNotExist:
		return HttpResponseRedirect('')
	t = get_template("simplesubmit.html")
	# Set context based on user
	# Use Request Context for pages that load with a CSRF token
	rc = RequestContext(request, {"user": currentUser, "results": "Nothing Submitted!"})
	html = t.render(rc)
	return HttpResponse(html)

# This is the teeacher navigation page
def teacher(request):
	# Load user_id variable with session, match to user, set context based on user
	# Use Request Context for pages that load with a CSRF token
	return HttpResponse("This is the teacher view.")

# This is an API function that reads in the submitted data from the 
# form and then renders the output back on the editing page in the 
# solutions textbox.
def submit(request):
	results = "Failure."
	if request.method == 'POST':
		if "solution" in request.POST:
			# Do something with this solution and set the fedback to the "results" var
			solution = request.POST["solution"]
			if solution == "Test input.":
				results = "Good Work There!"
			else:
				results = "Wrong!"
			t = get_template("simplesubmit.html")
			stud = Student(name="Shantanu Jain")
			rc = RequestContext(request, {"user": stud, "results": results})
			html = t.render(rc)
			return HttpResponse(html)
	else:
		return HttpResponseRedirect('')

# This is an API function that verifies the user and sends them to the student page. 
# It forwards to the student or teacher homepage depending on the type of user.
def login(request):
	error = "POST not sent"
	#return HttpResponse(User.objects.filter(email=request.POST["email"])[0])
	# Load POST data and read in email and password
	if ("email" in request.POST) and ("password" in request.POST):
		# Attempt to match to entry in database
		if len(User.objects.filter(email=request.POST["email"])) > 0:
			match = User.objects.filter(email=request.POST["email"])[0]
			if match.password == request.POST["password"]: #password and email match
				# Set session user_id var
				request.session["user_id"] = match.user_id
				# check if user.isAdmin, if so, forward to teacher page
				if match.isAdmin:
					# Forward to teacher page, load with session
					return HttpResponseRedirect('teacher/')
				# else the user is student, forward to student page
				else:
					# Forward to student page, load with session
					return HttpResponseRedirect('student/')
			# otherwise create json function with the error string
			else:
				error = "Wrong password."
		else:
			error = "No email match found."

	# Serialize to JSON and return error 
	errorJsonDict = {}
	errorJsonDict["error"] = error
	errorJson = simplejson.dumps(errorJsonDict)
	return HttpResponse(errorJson, content_type="application/json")

# This is an API function that registers a new user in the database. Checks for uniqueness
# of email address. Only returns JSON with isOkay and error. After successful signup, frontend
# will prompt user for further action
def signup(request):
	isOkay = True
	error = "Sign up successful!"
	# Load POST data and read in name, email, password, and isAdmin
	if ("name" in request.POST) and ("email" in request.POST) and ("password" in request.POST) and ("isAdmin" in request.POST):
		# Check for matching email addresses in the database. If the returned array is 0 length,
		# continue registering user. Otherwise, update error
		name = request.POST["name"]
		email = request.POST["email"]
		password = request.POST["password"]
		isAdmin = request.POST["isAdmin"]
		if len(User.objects.filter(email=request.POST["email"])) == 0: # no matching email found
			# IMPLEMENT: Validate other fields
			newMember = User(name=name, email=email, password=password, isAdmin=isAdmin)
			newMember.save()
		else:
			isOkay = False
			error = "This email already exists! Please log in."
	else:
		isOkay = False
		error = "Not all fields filled!"

	# Serialize errors and send JSON object
	errorJsonDict = {}
	errorJsonDict["error"] = error
	errorJsonDict["isOkay"] = isOkay
	errorJson = simplejson.dumps(errorJsonDict)
	return HttpResponse(errorJson, content_type="application/json")

# This is an API function that logs out a current user by deleting their session.
# It forwards the user back to the login page
def logout(request):
	try: 
		del request.session["user_id"]
	except KeyError:
		pass
	return HttpResponseRedirect('')