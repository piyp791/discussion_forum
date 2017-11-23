def get_parent_tags(parent_id, post_tree):
	root = post_tree.getroot();
	for child in root:
		post_id = child.get('Id');
		if parent_id == post_id:
			tags = child.get('Tags')
			return tags

def split_tags_str(tag_str):
	tag_str =  tag_str[1:-1];
	tag_arr = tag_str.split('><')
	return tag_arr

def find_user_list_from_posts(post_tree):
	users = []
	root = post_tree.getroot();
	for child in root:
		userid = child.get('OwnerUserId');
		if userid not in users:
			users.append(userid);
	return users

def find_user_list_from_comments(comment_tree):
	users = []
	root = comment_tree.getroot();
	for child in root:
		userid = child.get('UserId');
		if userid not in users:
			users.append(userid);
	return users

def get_all_users(user_tree):
	users = []
	root = user_tree.getroot();
	for child in root:
		userid = child.get('Id');
		if userid not in users:
			users.append(userid);
	return users